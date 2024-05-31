import { error } from '@sveltejs/kit';
import { and, desc, eq, getTableColumns, inArray, isNotNull, notInArray, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { POSTS_PER_SECTION, SECTIONS_PER_LOAD } from '$lib/collections/constants';
import { db } from '$lib/services/db';

import type { ArticleSelect } from '../article/parsers';
import { articles } from '../article/schema';
import { users } from '../user/schema';
import type { ActorService } from '../user/service';
import { isNonNullable } from '../common/utils';
import { translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { RecordsTranslations } from '../i18n/types';
import type { ImagesDict } from '../image/types';
import type { PreviewFamiliesDict } from '../preview/families/types';
import { previewTemplates } from '../preview/schema';
import { sectionDeleteSchema, sectionInsertSchema, sectionUpdateSchema } from '../section/parsers';
import { sections, sectionsToTags } from '../section/schema';
import type { SectionService } from '../section/service';
import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
import { tags, tagsToArticles } from '../tag/schema';
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

	async create(page: PageCreateForm) {
		const actor = await this.actorService.getOrThrow();
		return db
			.insert(pages)
			.values({ ...page, user_id: actor.id })
			.run();
	}
	async update(page: PageUpdateForm) {
		const actor = await this.actorService.getOrThrow();
		return db
			.update(pages)
			.set(page)
			.where(and(eq(pages.id, page.id), eq(pages.user_id, actor.id)))
			.run();
	}
	async delete(id: PageSelect['id']) {
		const actor = await this.actorService.getOrThrow();
		return db
			.delete(pages)
			.where(and(eq(pages.id, id), eq(pages.user_id, actor.id)))
			.run();
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
		let tagsAndTheirTranslationsPromise = db
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
		) as RecordsTranslations;

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
			}, tagsTranslationsAsObject as RecordsTranslations),
			images: sectionsNonEmpty.reduce((acc, s) => {
				return { ...acc, ...s.images };
			}, {} as ImagesDict),
			tags: tagsAndTheirTranslationsInfo.map((t) => t.tag)
		};
	}
}
