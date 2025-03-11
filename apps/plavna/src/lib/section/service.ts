import { error } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { SECTIONS_PER_PAGE } from '$lib/common/config';
import { db } from '$lib/db/db';
import { ERRORS } from '$lib/errors/errors';

import type { TransactionOrDB } from '../common/types';
import { dedupeArray } from '../common/utils';
import { table_translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import { table_pages } from '../page/schema';
import { getPreviewFamiliesDict } from '../preview/utils';
import { table_tags } from '../tag/schema';
import type { ActorService } from '../user/service';
import { queryGetOneSection, queryGetSectionsQuantity } from './queries';
import { table_sections, table_sections_to_tags } from './schema';
import type { GetOneSectionParams, TagIdWithLang } from './types';
import { findTagsInSectionTranslations } from './utils';
import {
	sectionDeleteSchema,
	sectionUpdateSchema,
	type SectionDelete,
	type SectionInsert,
	type SectionUpdate
} from './validators';

export class SectionService {
	private readonly actorService: ActorService;
	private readonly translationService: TranslationService;

	constructor(actorService: ActorService, translationService: TranslationService) {
		this.actorService = actorService;
		this.translationService = translationService;
	}

	private async validateTagsOwnership(tagsForCheck: TagIdWithLang[], trx: TransactionOrDB = db) {
		const actor = await this.actorService.get();
		if (!actor) return;

		const tagIds = tagsForCheck.map((tag) => tag.tag_id);
		const tagIdsDeduped = dedupeArray(tagIds);

		const existingForUser = await trx
			.select({ tag_id: table_tags.id })
			.from(table_tags)
			.where(and(inArray(table_tags.id, tagIdsDeduped), eq(table_tags.user_id, actor.id)))
			.all();

		if (existingForUser.length !== tagIdsDeduped.length) {
			error(403, ERRORS.SOME_TAGS_DONT_EXIST);
		}
	}

	async getOne(config: GetOneSectionParams) {
		// 0. Prepare info needed for queries
		const actor = await this.actorService.get();
		const lang = this.translationService.currentLang;

		// 1. Query the DB
		const queryResult = await queryGetOneSection(config, actor, lang);

		if (!queryResult) return null;

		const { section, previewFamilyIds, ...other } = queryResult;
		const { title_translation, ...otherSection } = section;

		// 2. Composing forms for actor if allowed
		let forAuthor = null;
		if (actor && actor.id === section.meta.user_id) {
			const t = title_translation;
			if (!t) throw Error("Couldn't add section description forms");

			const sid = section.meta.id;
			const updatingData = { ...title_translation, section_id: sid };
			const deletionData = { section_id: sid };
			forAuthor = {
				updating: await superValidate(updatingData, zod(sectionUpdateSchema), {
					id: `section-updating-${t.key}`
				}),
				deletion: await superValidate(deletionData, zod(sectionDeleteSchema), {
					id: `section-deletion-${t.key}`
				})
			};
		}

		// 3. Composing previewFamilies dict
		const previewFamilies = getPreviewFamiliesDict(previewFamilyIds);

		// 4. Return
		return {
			section: {
				forAuthor: forAuthor,
				...otherSection
			},
			previewFamilies: previewFamilies,
			...other
		};
	}
	async create(pagename: string, section: SectionInsert) {
		const actor = await this.actorService.getOrThrow();

		const result = await queryGetSectionsQuantity(pagename, actor.id);
		if (!result || result.count >= SECTIONS_PER_PAGE) {
			error(403, ERRORS.TOO_MANY_SECTIONS_ON_PAGE);
		}

		const uniqueTags = findTagsInSectionTranslations(section);
		if (uniqueTags.length) {
			await this.validateTagsOwnership(uniqueTags);
		}

		await db.transaction(async (trx) => {
			const translationForRecord = { ...section, user_id: actor.id };
			const [createdTranslation] = await this.translationService.create(
				[translationForRecord],
				'disallow-empty',
				trx
			);
			const page = await trx
				.select({ page_id: table_pages.id })
				.from(table_pages)
				.where(and(eq(table_pages.slug, pagename), eq(table_pages.user_id, actor.id)))
				.get();
			if (!page) {
				error(403, ERRORS.NO_SUCH_PAGE_TO_CREATE_POST_ON);
			}
			const { page_id } = page;
			const { section_id } = await trx
				.insert(table_sections)
				.values({ user_id: actor.id, page_id, title_translation_key: createdTranslation.key })
				.returning({ section_id: table_sections.id })
				.get();

			if (uniqueTags.length) {
				await trx
					.insert(table_sections_to_tags)
					.values(uniqueTags.map((tag) => ({ ...tag, section_id })))
					.run();
			}
		});
	}
	async update(sectionUpdate: SectionUpdate) {
		const actor = await this.actorService.getOrThrow();
		const { section_id, ...langsTranslations } = sectionUpdate;
		const uniqueTags = findTagsInSectionTranslations(langsTranslations);

		if (uniqueTags.length) {
			await this.validateTagsOwnership(uniqueTags);
		}

		// Getting translation id
		const translation = await db
			.select({ key: table_translations.key })
			.from(table_sections)
			.innerJoin(
				table_translations,
				eq(table_sections.title_translation_key, table_translations.key)
			)
			.where(and(eq(table_sections.id, section_id), eq(table_sections.user_id, actor.id)))
			.get();
		if (!translation) {
			error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
		}

		await db.transaction(async (trx) => {
			await this.translationService.update({ ...langsTranslations, key: translation.key }, trx);

			await trx
				.delete(table_sections_to_tags)
				.where(eq(table_sections_to_tags.section_id, section_id))
				.run();
			if (uniqueTags.length) {
				await trx
					.insert(table_sections_to_tags)
					.values(uniqueTags.map((tag) => ({ ...tag, section_id })))
					.run();
			}
		});
	}
	// TODO: Remake all delete params to just id
	async delete(sectionDelete: SectionDelete) {
		const actor = await this.actorService.getOrThrow();

		await db.transaction(async (trx) => {
			const translation = await trx
				.select({ title_translation_key: table_sections.title_translation_key })
				.from(table_sections)
				.where(
					and(eq(table_sections.id, sectionDelete.section_id), eq(table_sections.user_id, actor.id))
				)
				.get();
			if (!translation) {
				error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
			}
			const { title_translation_key } = translation;
			await this.translationService.delete({ key: title_translation_key }, trx);
			await trx
				.delete(table_sections_to_tags)
				.where(and(eq(table_sections_to_tags.section_id, sectionDelete.section_id)))
				.run();
		});
	}
}
