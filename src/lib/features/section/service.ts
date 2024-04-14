import { supportedLangs } from '@denlukia/plavna-common/constants';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import { error } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';
import { marked } from 'marked';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import type { UserService } from '../auth/service';
import { nonNull } from '../common/utils';
import type { TranslationInsert } from '../i18n/parsers';
import type { TranslationService } from '../i18n/service';
import { pages } from '../page/schemas';
import type { TagUpdate } from '../tag/parsers';
import { tags } from '../tag/schemas';
import type { SectionDelete, SectionUpdate } from './parsers';
import { sections, sectionsToTags } from './schemas';
import { findTagIdsInLinks } from './utils';

export class SectionService {
	private readonly userService: UserService;
	private readonly translationService: TranslationService;

	constructor(userService: UserService, translationService: TranslationService) {
		this.userService = userService;
		this.translationService = translationService;
	}
	async create(pagename: string, translation: TranslationInsert) {
		const user = await this.userService.getOrThrow();
		const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

		supportedLangs.forEach((lang) => {
			const translationText = translation[lang];
			if (nonNull(translationText)) {
				const tokens = marked.lexer(translationText);
				const thisLangTags = findTagIdsInLinks(tokens);
				foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
			}
		});

		await db.transaction(async (trx) => {
			const translationForRecord = { ...translation, user_id: user.id };
			const [createdTranslation] = await this.translationService.create(
				[translationForRecord],
				'disallow-empty',
				trx
			);
			const page = await trx
				.select({ page_id: pages.id })
				.from(pages)
				.where(and(eq(pages.slug, pagename), eq(pages.user_id, user.id)))
				.get();
			if (!page) {
				error(403, ERRORS.NO_SUCH_PAGE_TO_CREATE_POST_ON);
			}
			const { page_id } = page;
			const { section_id } = await trx
				.insert(sections)
				.values({ user_id: user.id, page_id, title_translation_key: createdTranslation.key })
				.returning({ section_id: sections.id })
				.get();

			if (foundTags.length) {
				// Tag ownership check
				const foundUnique = [...new Set(foundTags.map((tag) => tag.tag_id))];
				const existingForUser = await trx
					.select({ tag_id: tags.id })
					.from(tags)
					.where(and(inArray(tags.id, foundUnique), eq(tags.user_id, user.id)))
					.all();
				if (existingForUser.length !== foundUnique.length) {
					error(403, ERRORS.SOME_TAGS_DONT_EXIST);
				}

				await trx
					.insert(sectionsToTags)
					.values(foundTags.map((tag) => ({ ...tag, section_id })))
					.run();
			}
		});
	}
	async update(sectionUpdate: SectionUpdate) {
		const user = await this.userService.getOrThrow();
		const { section_id, ...translation } = sectionUpdate;
		const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

		supportedLangs.forEach((lang) => {
			const translationText = translation[lang];
			if (nonNull(translationText)) {
				const tokens = marked.lexer(translationText);
				const thisLangTags = findTagIdsInLinks(tokens);
				foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
			}
		});

		await db.transaction(async (trx) => {
			await this.translationService.update(translation, trx);

			// Will throw if section does not exist
			await trx
				.select({ section_id: sections.id })
				.from(sections)
				.where(and(eq(sections.id, section_id), eq(sections.user_id, user.id)))
				.get();

			// Tag ownership check
			if (foundTags.length) {
				const foundUnique = [...new Set(foundTags.map((tag) => tag.tag_id))];
				const existingForUser = await trx
					.select({ tag_id: tags.id })
					.from(tags)
					.where(and(inArray(tags.id, foundUnique), eq(tags.user_id, user.id)))
					.all();
				if (existingForUser.length !== foundUnique.length) {
					error(403, ERRORS.SOME_TAGS_DONT_EXIST);
				}
			}

			await trx.delete(sectionsToTags).where(eq(sectionsToTags.section_id, section_id)).run();
			if (foundTags.length) {
				await trx
					.insert(sectionsToTags)
					.values(foundTags.map((tag) => ({ ...tag, section_id })))
					.run();
			}
		});
	}
	// TODO Remake all delete params to just id
	async delete(sectionDelete: SectionDelete) {
		const user = await this.userService.getOrThrow();

		await db.transaction(async (trx) => {
			const translation = await trx
				.select({ title_translation_key: sections.title_translation_key })
				.from(sections)
				.where(and(eq(sections.id, sectionDelete.id), eq(sections.user_id, user.id)))
				.get();
			if (!translation) {
				error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
			}
			const { title_translation_key } = translation;
			await this.translationService.delete({ key: title_translation_key }, trx);
			await trx
				.delete(sectionsToTags)
				.where(and(eq(sectionsToTags.section_id, sectionDelete.id)))
				.run();
		});
	}
}
