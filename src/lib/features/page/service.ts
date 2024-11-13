import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { SECTIONS_PER_LOAD } from '$lib/collections/constants';
import { db } from '$lib/services/db';

import { isNonNullable } from '../common/utils';
import { detectConstraintError } from '../error/detectors';
import { ErrorWithTranslation } from '../error/ErrorWithTranslation';
import { translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { RecordsTranslationsDict, SystemTranslationKey } from '../i18n/types';
import type { ImagesDict } from '../image/types';
import type { PreviewFamiliesDict } from '../preview/families/types';
import { sectionInsertSchema } from '../section/parsers';
import type { SectionService } from '../section/service';
import { tags } from '../tag/schema';
import { users } from '../user/schema';
import type { ActorService } from '../user/service';
import {
	pageCreationFormSchema,
	pageDeletionFormSchema,
	pageUpdatingFormSchema,
	type PageCreateForm,
	type PageSelect,
	type PageUpdateForm,
	type ReaderPageConfig
} from './parsers';
import { pages } from './schema';

export class PageService {
	private readonly actorService: ActorService;
	private readonly translationService: TranslationService;
	private readonly sectionService: SectionService;

	constructor(
		actorService: ActorService,
		translationService: TranslationService,
		sectionService: SectionService
	) {
		this.actorService = actorService;
		this.translationService = translationService;
		this.sectionService = sectionService;
	}

	private selectErrorWithTranslation(
		action: 'create' | 'update' | 'delete',
		error: unknown,
		slug?: string
	) {
		let message: SystemTranslationKey = 'actor_errors.unknown_error';

		if (error instanceof Error && detectConstraintError(error)) {
			if (['create', 'update'].includes(action)) {
				message = slug ? 'actor_errors.slug_in_use' : 'actor_errors.only_one_default_slug';
			} else if (action === 'delete') {
				message = 'actor_errors.cannot_delete';
			} else {
				message = 'actor_errors.unknown_error';
			}
		}

		return new ErrorWithTranslation(message);
	}

	async create(page: PageCreateForm) {
		const actor = await this.actorService.getOrThrow();
		try {
			const result = await db
				.insert(pages)
				.values({ ...page, user_id: actor.id })
				.run();
			return result;
		} catch (e) {
			throw this.selectErrorWithTranslation('create', e, page.slug);
		}
	}
	async update(page: PageUpdateForm) {
		const actor = await this.actorService.getOrThrow();
		try {
			const result = await db
				.update(pages)
				.set(page)
				.where(and(eq(pages.id, page.id), eq(pages.user_id, actor.id)))
				.run();
			return result;
		} catch (e) {
			throw this.selectErrorWithTranslation('update', e, page.slug);
		}
	}
	async delete(id: PageSelect['id']) {
		const actor = await this.actorService.getOrThrow();
		try {
			const result = await db
				.delete(pages)
				.where(and(eq(pages.id, id), eq(pages.user_id, actor.id)))
				.run();
			return result;
		} catch (e) {
			throw this.selectErrorWithTranslation('delete', e);
		}
	}
	async getMyAsForms(username: string) {
		const actor = await this.actorService.checkOrThrow(null, username);
		const query = await db.select().from(pages).where(eq(pages.user_id, actor.id)).all();
		const pageItems = await Promise.all(
			query.map(async (page) => {
				return {
					id: page.id,
					slug: page.slug,
					editingForm: await superValidate(page, zod(pageUpdatingFormSchema), {
						id: 'page-edit-' + page.id
					}),
					deletionForm: await superValidate(page, zod(pageDeletionFormSchema), {
						id: 'page-delete-' + page.id
					})
				};
			})
		);
		const creationForm = await superValidate(null, zod(pageCreationFormSchema), {
			id: 'page-create'
		});
		return { pageItems, creationForm };
	}
	// TODO: Currently I see no way of DRYing with keeping good types
	async getOneWithSectionsAndArticles(
		username: string,
		pageslug: string,
		readerPageConfig: ReaderPageConfig | null
	) {
		const actor = await this.actorService.get();

		// 0. Utilitary queries
		const userIdSq = db.select({ id: users.id }).from(users).where(eq(users.username, username));
		const lang = this.translationService.currentLang;

		const pagePromise = db
			.select()
			.from(pages)
			.where(and(eq(pages.slug, pageslug), eq(pages.user_id, userIdSq)))
			.get();
		const tagsAndTheirTranslationsPromise = db
			.select({
				tag: { id: tags.id, name_translation_key: translations.key },
				translation: { key: translations.key, [lang]: translations[lang] }
			})
			.from(tags)
			.innerJoin(translations, eq(tags.name_translation_key, translations.key))
			.where(and(eq(userIdSq, actor?.id || ''), eq(tags.user_id, userIdSq)))
			.all();

		const [pageInfo, tagsAndTheirTranslationsInfo] = await Promise.all([
			pagePromise,
			tagsAndTheirTranslationsPromise
		]);
		const tagsTranslationsAsObject = Object.fromEntries(
			tagsAndTheirTranslationsInfo.map(({ translation: { key, [lang]: translation } }) => [
				key,
				translation
			])
		) as RecordsTranslationsDict;

		if (!pageInfo) {
			error(404);
		}

		const sectionsPromises = new Array(SECTIONS_PER_LOAD).fill(null).map(async (_, offset) => {
			return this.sectionService.getOne({
				pageId: pageInfo.id,
				offset,
				readerPageConfig,
				username
			});
		});
		const sectionsResponses = await Promise.all(sectionsPromises);

		const sectionsNonEmpty = sectionsResponses.filter(isNonNullable);

		// TODO: Maybe replace such check with check by id
		const canAddForms = actor?.username === username;

		return {
			sections: {
				items: sectionsNonEmpty.map((s) => s.section),
				creationForm: canAddForms ? await superValidate(zod(sectionInsertSchema)) : null
			},
			previewFamilies: sectionsNonEmpty.reduce((acc, { previewFamilies }) => {
				const result = {
					...acc,
					...previewFamilies
				};
				if ('custom' in previewFamilies) {
					result.custom = { ...acc.custom, ...previewFamilies.custom };
				}
				return result;
			}, {} as PreviewFamiliesDict),
			recordsTranslations: sectionsNonEmpty.reduce((acc, s) => {
				return { ...acc, ...s.recordsTranslations };
			}, tagsTranslationsAsObject as RecordsTranslationsDict),
			images: sectionsNonEmpty.reduce((acc, s) => {
				return { ...acc, ...s.images };
			}, {} as ImagesDict),
			tags: tagsAndTheirTranslationsInfo.map((t) => t.tag)
		};
	}
}
