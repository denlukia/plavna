import { error } from '@sveltejs/kit';
import { and, desc, eq, getTableColumns, inArray, isNotNull, notInArray, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { POSTS_PER_SECTION } from '$lib/collections/constants';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import type { ArticleSelect } from '../article/parsers';
import { articles } from '../article/schema';
import type { ActorService } from '../auth/service';
import type { TransactionOrDB } from '../common/types';
import { dedupeArray, getNullAndDupFilter, isNonNullable } from '../common/utils';
import { translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { RecordsTranslationsDict } from '../i18n/types';
import type { ImageSelect } from '../image/parsers';
import { images } from '../image/schema';
import type { ImagesDict } from '../image/types';
import type { PageSelect, ReaderPageConfig } from '../page/parsers';
import { pages } from '../page/schema';
import { findExcludedTagsInReaderPageConfig } from '../page/utils';
import type { PreviewFamiliesDict } from '../preview/families/types';
import { previewTemplates } from '../preview/schema';
import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
import { tags, tagsToArticles } from '../tag/schema';
import {
	sectionDeleteSchema,
	sectionUpdateSchema,
	type SectionDelete,
	type SectionInsert,
	type SectionSelect,
	type SectionUpdate
} from './parsers';
import { sections, sectionsToTags } from './schema';
import type { TagIdWithLang } from './types';
import { findTagsInSectionTranslations } from './utils';

type GetOneConfig = { username: string } & (
	| { pageId: PageSelect['id']; offset: number }
	| { sectionId: SectionSelect['id']; readerPageConfig: ReaderPageConfig | null }
);

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
			.select({ tag_id: tags.id })
			.from(tags)
			.where(and(inArray(tags.id, tagIdsDeduped), eq(tags.user_id, actor.id)))
			.all();

		if (existingForUser.length !== tagIdsDeduped.length) {
			error(403, ERRORS.SOME_TAGS_DONT_EXIST);
		}
	}

	async getOne(config: GetOneConfig) {
		const actor = await this.actorService.get();

		const whereCondition1 =
			actor?.username === config.username
				? undefined
				: isNotNull(translations[this.translationService.currentLang]);
		const whereCondition2 =
			'pageId' in config ? eq(sections.page_id, config.pageId) : eq(sections.id, config.sectionId);
		const offset = 'offset' in config ? config.offset : 0;

		// 1. Sections query
		const sectionInfo = await db
			.select(getTableColumns(sections))
			.from(sections)
			.innerJoin(translations, eq(translations.key, sections.title_translation_key))
			.where(and(whereCondition1, whereCondition2))
			.limit(1)
			.offset(offset)
			.get();

		if (!sectionInfo) return null;

		// 1.5. Active tags query
		const readerPageConfig = 'readerPageConfig' in config ? config.readerPageConfig : {};
		const excludedTags = findExcludedTagsInReaderPageConfig(readerPageConfig, sectionInfo.id);
		const excludedTagsConfition = excludedTags.length
			? notInArray(sectionsToTags.tag_id, excludedTags)
			: undefined;
		const activeTagsQuery = db
			.select({ id: sectionsToTags.tag_id })
			.from(sectionsToTags)
			.where(
				and(
					eq(sectionsToTags.lang, this.translationService.currentLang),
					eq(sectionsToTags.section_id, sectionInfo.id),
					excludedTagsConfition
				)
			);

		// 2. Articles query
		const translationForTag = alias(translations, 'translation_for_tag');
		const translationForArticle = alias(translations, 'translation_for_article');
		const tagsCondition = inArray(tags.id, activeTagsQuery);

		const articlesQuery = db
			.select(getTableColumns(articles))
			.from(tags)
			.innerJoin(tagsToArticles, eq(tagsToArticles.tag_id, tags.id))
			.innerJoin(articles, eq(articles.id, tagsToArticles.article_id))
			.innerJoin(
				translationForTag,
				and(
					eq(translationForTag.key, tags.name_translation_key),
					isNotNull(translationForTag[this.translationService.currentLang])
				)
			)
			.innerJoin(
				translationForArticle,
				and(
					eq(translationForArticle.key, articles.title_translation_key),
					isNotNull(translationForArticle[this.translationService.currentLang])
				)
			)
			.where(and(isNotNull(articles.publish_time), tagsCondition))
			.orderBy(desc(articles.publish_time))
			.groupBy(articles.id)
			.limit(POSTS_PER_SECTION);

		const getBaselineOfArticlesQueryForTranslation = (
			field: (typeof articles)['title_translation_key' | 'description_translation_key']
		) =>
			db
				.select({ id: field })
				.from(tags)
				.innerJoin(tagsToArticles, eq(tagsToArticles.tag_id, tags.id))
				.innerJoin(articles, eq(articles.id, tagsToArticles.article_id))
				.where(and(isNotNull(articles.publish_time), tagsCondition))
				.orderBy(desc(articles.publish_time))
				.groupBy(articles.id)
				.limit(POSTS_PER_SECTION);

		const articlesQueryForTitleTranslations = getBaselineOfArticlesQueryForTranslation(
			articles.title_translation_key
		);
		const articlesQueryForDescriptionTranslations = getBaselineOfArticlesQueryForTranslation(
			articles.description_translation_key
		);
		const articlesQueryAliased = articlesQuery.as('articles_sq');

		// 3. Tags articles query
		const tagsArticlesQuery = db
			.select({ tag_id: tagsToArticles.tag_id, article_id: tagsToArticles.article_id })
			.from(articlesQueryAliased)
			.innerJoin(tagsToArticles, eq(tagsToArticles.article_id, articlesQueryAliased.id))
			.innerJoin(tags, eq(tags.id, tagsToArticles.tag_id))
			.innerJoin(
				translations,
				and(
					eq(translations.key, tags.name_translation_key),
					isNotNull(translations[this.translationService.currentLang])
				)
			);
		const tagsArticlesQueryAliased = tagsArticlesQuery.as('tags_articles_sq');

		// 4. Tags
		const tagsQuery =
			actor?.username === config.username
				? db.select(getTableColumns(tags)).from(tags).where(eq(tags.user_id, actor?.id))
				: db
						.select(getTableColumns(tags))
						.from(tagsArticlesQueryAliased)
						.innerJoin(tags, eq(tags.id, tagsArticlesQueryAliased.tag_id))
						.groupBy(tags.id);
		const tagsQueryForTranslations =
			actor?.username === config.username
				? db.select({ id: tags.name_translation_key }).from(tags).where(eq(tags.user_id, actor?.id))
				: db
						.select({ id: tags.name_translation_key })
						.from(articlesQueryAliased)
						.innerJoin(tagsToArticles, eq(tagsToArticles.article_id, articlesQueryAliased.id))
						.innerJoin(tags, eq(tags.id, tagsToArticles.tag_id))
						.innerJoin(
							translations,
							and(
								eq(translations.key, tags.name_translation_key),
								isNotNull(translations[this.translationService.currentLang])
							)
						);

		// 5. Description Translation query
		const descriptionTranslationQuery = db
			.select()
			.from(translations)
			.where(eq(translations.key, sectionInfo.title_translation_key))
			.limit(1);

		// 6. Preview types query
		const previewTypesQuery = db
			.select({ id: previewTemplates.id, url: previewTemplates.url })
			.from(articlesQueryAliased)
			.innerJoin(
				previewTemplates,
				eq(previewTemplates.id, articlesQueryAliased.preview_template_id)
			)
			.groupBy(previewTemplates.id);

		// 7. Preview Images query
		const previewImagesQuery = db
			.select(getTableColumns(images))
			.from(articlesQueryAliased)
			.innerJoin(
				images,
				or(
					eq(images.id, articlesQueryAliased.preview_image_1_id),
					eq(images.id, articlesQueryAliased.preview_image_2_id),
					eq(images.id, articlesQueryAliased.preview_screenshot_image_id)
				)
			);

		const previewImagesQueryForTranslations = db
			.select({ id: images.path_translation_key })
			.from(articlesQueryAliased)
			.innerJoin(
				images,
				or(
					eq(images.id, articlesQueryAliased.preview_image_1_id),
					eq(images.id, articlesQueryAliased.preview_image_2_id),
					eq(images.id, articlesQueryAliased.preview_screenshot_image_id)
				)
			);

		// 8. Other Translations query
		// TODO: This is the most row-reads heavy query in analytics
		const otherTranslationsQuery = db
			.select({
				key: translations.key,
				[this.translationService.currentLang]: translations[this.translationService.currentLang]
			})
			.from(translations)
			.where(
				and(
					or(
						inArray(translations.key, articlesQueryForTitleTranslations),
						inArray(translations.key, articlesQueryForDescriptionTranslations),
						inArray(translations.key, tagsQueryForTranslations),
						inArray(translations.key, previewImagesQueryForTranslations)
					),
					isNotNull(translations[this.translationService.currentLang])
				)
			)
			.groupBy(translations.key);

		const activeTagsPromise = activeTagsQuery.all();
		const articlesPromise = articlesQuery.all();
		const tagsArticlesPromise = tagsArticlesQuery.all();
		const tagsPromise = tagsQuery.all();
		const descriptionTranslationPromise = descriptionTranslationQuery.get();
		const previewTypesPromise = previewTypesQuery.all();
		const previewImagesPromise = previewImagesQuery.all();
		const otherTranslationsPromise = otherTranslationsQuery.all();

		const [
			activeTagsInfo,
			articlesInfo,
			tagsArticlesInfo,
			tagsInfo,
			descriptionTranslationInfo,
			previewTypesInfo,
			previewImagesInfo,
			otherTranslationsInfo
		] = await Promise.all([
			activeTagsPromise,
			articlesPromise,
			tagsArticlesPromise,
			tagsPromise,
			descriptionTranslationPromise,
			previewTypesPromise,
			previewImagesPromise,
			otherTranslationsPromise
		]);

		if (!descriptionTranslationInfo) {
			error(500, 'Translation for section not found');
		}

		const getArticle = (
			article: ArticleSelect,
			tagsToArticles: TagToArticleSelect[],
			tagsInfo: TagSelect[]
		) => {
			const filteredTagsToArticles = tagsToArticles.filter(
				({ article_id }) => article_id === article.id
			);
			const tags = tagsInfo.filter(({ id }) =>
				filteredTagsToArticles.some(({ tag_id }) => tag_id === id)
			);

			return { meta: article, tags };
		};

		const canAddForms = actor?.username === config.username;

		type SectionInfo = typeof sectionInfo;
		type DescriptionTranslationInfo = typeof descriptionTranslationInfo;

		const getForms = async (sectionInfo: SectionInfo, t: DescriptionTranslationInfo) => {
			if (!t) throw new Error('Translation not found');
			if (canAddForms) {
				const data = { ...t, section_id: sectionInfo.id };
				return {
					updating: await superValidate(data, zod(sectionUpdateSchema), {
						id: `section-updating-${t.key}`
					}),
					deletion: await superValidate(data, zod(sectionDeleteSchema), {
						id: `section-deletion-${t.key}`
					})
				};
			} else {
				return null;
			}
		};

		const previewDictEntryTemplate = {
			components: { viewer: null, editor: null, Preview: null }
		};

		const getPreviewDictEntry = (previewFamilyId: NonNullable<ArticleSelect['preview_family']>) => {
			if (previewFamilyId === 'custom') {
				return [
					previewFamilyId,
					{
						...previewDictEntryTemplate,
						...Object.fromEntries(
							previewTypesInfo.filter(getNullAndDupFilter('id')).map((p) => {
								return [p.id, p.url];
							})
						)
					}
				];
			}
			return [previewFamilyId, previewDictEntryTemplate];
		};

		const getImageDictEntry = ({
			id,
			path,
			path_translation_key,
			width,
			height,
			background,
			source
		}: ImageSelect) => [id, { path, path_translation_key, width, height, background, source }];

		return {
			section: {
				meta: sectionInfo,
				activeTags: activeTagsInfo,
				articles: articlesInfo.map((article) => getArticle(article, tagsArticlesInfo, tagsInfo)),
				forms: await getForms(sectionInfo, descriptionTranslationInfo)
			},
			recordsTranslations: {
				// Description Translation
				[descriptionTranslationInfo.key]:
					descriptionTranslationInfo[this.translationService.currentLang],
				// Other Translations
				...Object.fromEntries(
					otherTranslationsInfo.map((t) => {
						return [t.key, t[this.translationService.currentLang]];
					})
				)
			} as RecordsTranslationsDict,
			previewFamilies: Object.fromEntries(
				dedupeArray(articlesInfo.map((a) => a.preview_family).filter(isNonNullable)).map(
					getPreviewDictEntry
				)
			) as PreviewFamiliesDict,
			images: Object.fromEntries(previewImagesInfo.map(getImageDictEntry)) as ImagesDict
		};
	}
	async create(pagename: string, section: SectionInsert) {
		const actor = await this.actorService.getOrThrow();
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
				.select({ page_id: pages.id })
				.from(pages)
				.where(and(eq(pages.slug, pagename), eq(pages.user_id, actor.id)))
				.get();
			if (!page) {
				error(403, ERRORS.NO_SUCH_PAGE_TO_CREATE_POST_ON);
			}
			const { page_id } = page;
			const { section_id } = await trx
				.insert(sections)
				.values({ user_id: actor.id, page_id, title_translation_key: createdTranslation.key })
				.returning({ section_id: sections.id })
				.get();

			if (uniqueTags.length) {
				await trx
					.insert(sectionsToTags)
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
			.select({ key: translations.key })
			.from(sections)
			.innerJoin(translations, eq(sections.title_translation_key, translations.key))
			.where(and(eq(sections.id, section_id), eq(sections.user_id, actor.id)))
			.get();
		if (!translation) {
			error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
		}

		await db.transaction(async (trx) => {
			await this.translationService.update({ ...langsTranslations, key: translation.key }, trx);

			await trx.delete(sectionsToTags).where(eq(sectionsToTags.section_id, section_id)).run();
			if (uniqueTags.length) {
				await trx
					.insert(sectionsToTags)
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
				.select({ title_translation_key: sections.title_translation_key })
				.from(sections)
				.where(and(eq(sections.id, sectionDelete.section_id), eq(sections.user_id, actor.id)))
				.get();
			if (!translation) {
				error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
			}
			const { title_translation_key } = translation;
			await this.translationService.delete({ key: title_translation_key }, trx);
			await trx
				.delete(sectionsToTags)
				.where(and(eq(sectionsToTags.section_id, sectionDelete.section_id)))
				.run();
		});
	}
}
