import { error } from '@sveltejs/kit';
import {
	and,
	count,
	desc,
	eq,
	getTableColumns,
	gt,
	inArray,
	isNotNull,
	lt,
	max,
	min,
	notInArray,
	or,
	Placeholder,
	sql,
	SQL
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ARTICLES_PER_SECTION } from '$lib/collections/config';
import { ERRORS } from '$lib/collections/errors';
import { tags } from '$lib/collections/main-schema';
import { db } from '$lib/services/db';

import type { ArticleSelect } from '../article/parsers';
import { table_articles } from '../article/schema';
import { dedupeQueryResult, getTableColumnAliases } from '../common/drizzle';
import type { TransactionOrDB } from '../common/types';
import { dedupeArray, getNullAndDupFilter, isNonNullable } from '../common/utils';
import { table_translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { RecordsTranslationsDict } from '../i18n/types';
import type { ImageSelect } from '../image/parsers';
import { table_images } from '../image/schema';
import type { ImagesDict } from '../image/types';
import type { PageSelect, ReaderPageConfig } from '../page/parsers';
import { table_pages } from '../page/schema';
import { findExcludedTagsInReaderPageConfig } from '../page/utils';
import type { PreviewFamiliesDict } from '../preview/families/types';
import { table_previewTemplates } from '../preview/schema';
import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
import { table_tags, table_tagsToArticles } from '../tag/schema';
import type { ActorService } from '../user/service';
import {
	sectionDeleteSchema,
	sectionUpdateSchema,
	type SectionDelete,
	type SectionInsert,
	type SectionSelect,
	type SectionUpdate
} from './parsers';
import { table_sections, table_sectionsToTags } from './schema';
import type { TagIdWithLang } from './types';
import { findTagsInSectionTranslations } from './utils';

type GetOneConfig = { username: string } & (
	| { pageId: PageSelect['id']; offset: number }
	| { sectionId: SectionSelect['id']; readerPageConfig: ReaderPageConfig | null }
	| {
			sectionId: SectionSelect['id'];
			tsLessThan: number | undefined;
			tsGreaterThan: number | undefined;
	  }
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
			.select({ tag_id: table_tags.id })
			.from(table_tags)
			.where(and(inArray(table_tags.id, tagIdsDeduped), eq(table_tags.user_id, actor.id)))
			.all();

		if (existingForUser.length !== tagIdsDeduped.length) {
			error(403, ERRORS.SOME_TAGS_DONT_EXIST);
		}
	}

	async getOne(config: GetOneConfig) {
		// 0. Prepare info needed for queries
		const actor = await this.actorService.getOrThrow();
		const lang = this.translationService.currentLang;

		// 1. Section
		const sectionWhere: SQL[] = [];
		let sectionOffset = 0;

		if ('sectionId' in config) {
			sectionWhere.push(eq(table_sections.id, config.sectionId));
		}
		if ('pageId' in config) {
			sectionWhere.push(eq(table_sections.page_id, config.pageId));
			sectionOffset = config.offset;
		}

		const section = db
			.select({
				section_meta: getTableColumnAliases(table_sections)
			})
			.from(table_sections)
			.where(and(...sectionWhere))
			.offset(sectionOffset);
		const sectionSq = db.$with('sectionQuery').as(section);

		// 2. + its Tags + TagsToArticles
		const sectionTranslations = alias(table_translations, 'sectionTranslations'); // not using this causes weird bugs
		const sectionAndTags = db
			.with(sectionSq)
			.select({
				section_meta: sectionSq.section_meta,
				section_tags: getTableColumnAliases(table_tags),
				section_tags_to_articles: getTableColumnAliases(table_tagsToArticles),
				section_translations: getTableColumnAliases(sectionTranslations)
			})
			.from(sectionSq)
			.innerJoin(
				table_sectionsToTags,
				and(
					eq(sectionSq.section_meta.id, table_sectionsToTags.section_id),
					eq(table_sectionsToTags.lang, lang)
				)
			)
			.innerJoin(table_tags, eq(table_tags.id, table_sectionsToTags.tag_id))
			.innerJoin(table_tagsToArticles, eq(table_tagsToArticles.tag_id, table_tags.id))
			.innerJoin(
				sectionTranslations,
				or(
					eq(sectionTranslations.key, sectionSq.section_meta.title_translation_key),
					eq(sectionTranslations.key, table_tags.name_translation_key)
				)
			);
		// console.log(await sectionAndTags);
		const sectionAndTagsSq = db.$with('sectionAndTagsSq').as(sectionAndTags);

		// 3. + Articles
		const articles = db
			.with(sectionAndTagsSq)
			.select({
				section_meta: sectionAndTagsSq.section_meta,
				section_tags: sectionAndTagsSq.section_tags,
				section_translations: sectionAndTagsSq.section_translations,
				section_tags_to_articles: sectionAndTagsSq.section_tags_to_articles,
				articles: getTableColumnAliases(table_articles),
				max_article_publush_time: max(table_articles.publish_time).as('max_article_publush_time'),
				min_article_publush_time: min(table_articles.publish_time).as('min_article_publush_time')
			})
			.from(sectionAndTagsSq)
			.innerJoin(
				table_articles,
				eq(table_articles.id, sectionAndTagsSq.section_tags_to_articles.article_id)
			);

		const articlesSq = db.$with('articlesSq').as(articles);

		// 4. + Images + Article Tags + Translations + Date filter + Info for pagination
		const newerArticlesCondition = gt(
			articlesSq.articles.publish_time,
			articlesSq.max_article_publush_time
		);
		const olderArticlesCondition = lt(
			articlesSq.articles.publish_time,
			articlesSq.min_article_publush_time
		);

		const newerArticlesCount = db
			.with(articlesSq)
			.select({
				count: count().as('newerArticlesCount')
			})
			.from(articlesSq)
			.where(newerArticlesCondition);

		const olderArticlesCount = db
			.with(articlesSq)
			.select({
				count: count().as('olderArticlesCount')
			})
			.from(articlesSq)
			.where(olderArticlesCondition);

		console.log(await olderArticlesCount);
		console.log(await newerArticlesCount);

		const articlesAndAll = db
			.with(articlesSq)
			.select({
				// We put them to 1st layer to be able to dedupe
				section_meta: articlesSq.section_meta,
				section_tags: articlesSq.section_tags,
				section_translations: articlesSq.section_translations,

				// newerArticlesCount: newerArticlesCount,
				// olderArticlesCount: olderArticlesCount,

				images: table_images,
				tagsToArticles: table_tagsToArticles,
				tags: table_tags,
				translations: table_translations
			})
			.from(articlesSq)
			.innerJoin(
				table_images,
				or(
					eq(table_images.id, articlesSq.articles.preview_image_1_id),
					eq(table_images.id, articlesSq.articles.preview_image_2_id),
					eq(table_images.id, articlesSq.articles.preview_screenshot_image_id)
				)
			)
			.innerJoin(table_tagsToArticles, eq(articlesSq.articles.id, table_tagsToArticles.article_id))
			.innerJoin(table_tags, eq(table_tagsToArticles.tag_id, table_tags.id))
			.innerJoin(
				table_translations,
				or(
					eq(table_translations.key, articlesSq.articles.title_translation_key),
					eq(table_translations.key, articlesSq.articles.description_translation_key),
					eq(table_translations.key, articlesSq.articles.preview_translation_1_key),
					eq(table_translations.key, articlesSq.articles.preview_translation_2_key),
					eq(table_translations.key, table_tags.name_translation_key),
					eq(table_translations.key, table_images.path_translation_key)
				)
			);

		const result = await articlesAndAll;

		const deduped = dedupeQueryResult(result, {
			translations: (a, b) => a.key === b.key
		});

		console.dir(deduped, { depth: Infinity });

		return error(500, 'Not implemented');
	}
	async getOneOld(config: GetOneConfig) {
		const actor = await this.actorService.get();

		const whereCondition1 =
			actor?.username === config.username
				? undefined
				: isNotNull(table_translations[this.translationService.currentLang]);
		const whereCondition2 =
			'pageId' in config
				? eq(table_sections.page_id, config.pageId)
				: eq(table_sections.id, config.sectionId);

		const offset = 'offset' in config ? config.offset : 0;

		// 1. Sections query
		const sectionInfo = await db
			.select(getTableColumns(table_sections))
			.from(table_sections)
			.innerJoin(
				table_translations,
				eq(table_translations.key, table_sections.title_translation_key)
			)
			.where(and(whereCondition1, whereCondition2))
			.limit(1)
			.offset(offset)
			.get();

		if (!sectionInfo) return null;

		// 1.5. Active tags query
		const readerPageConfig = 'readerPageConfig' in config ? config.readerPageConfig : {};
		const excludedTags = findExcludedTagsInReaderPageConfig(readerPageConfig, sectionInfo.id);
		const excludedTagsConfition = excludedTags.length
			? notInArray(table_sectionsToTags.tag_id, excludedTags)
			: undefined;
		const activeTagsQuery = db
			.select({ id: table_sectionsToTags.tag_id })
			.from(table_sectionsToTags)
			.where(
				and(
					eq(table_sectionsToTags.lang, this.translationService.currentLang),
					eq(table_sectionsToTags.section_id, sectionInfo.id),
					excludedTagsConfition
				)
			);

		// 2. Articles query
		const translationForTag = alias(table_translations, 'translation_for_tag');
		const translationForArticle = alias(table_translations, 'translation_for_article');
		const tagsCondition = inArray(table_tags.id, activeTagsQuery);
		const timeCondition =
			'tsLessThan' in config && config.tsLessThan
				? lt(table_articles.publish_time, new Date(config.tsLessThan))
				: 'tsGreaterThan' in config && config.tsGreaterThan
					? gt(table_articles.publish_time, new Date(config.tsGreaterThan))
					: undefined;

		const articlesQuery = db
			.select(getTableColumns(table_articles))
			.from(table_tags)
			.innerJoin(table_tagsToArticles, eq(table_tagsToArticles.tag_id, table_tags.id))
			.innerJoin(table_articles, eq(table_articles.id, table_tagsToArticles.article_id))
			.innerJoin(
				translationForTag,
				and(
					eq(translationForTag.key, table_tags.name_translation_key),
					isNotNull(translationForTag[this.translationService.currentLang])
				)
			)
			.innerJoin(
				translationForArticle,
				and(
					eq(translationForArticle.key, table_articles.title_translation_key),
					isNotNull(translationForArticle[this.translationService.currentLang])
				)
			)
			.where(and(isNotNull(table_articles.publish_time), tagsCondition, timeCondition))
			.orderBy(desc(table_articles.publish_time))
			.groupBy(table_articles.id)
			.limit(ARTICLES_PER_SECTION);

		const getBaselineOfArticlesQueryForTranslation = (
			field: (typeof table_articles)['title_translation_key' | 'description_translation_key']
		) =>
			db
				.select({ id: field })
				.from(table_tags)
				.innerJoin(table_tagsToArticles, eq(table_tagsToArticles.tag_id, table_tags.id))
				.innerJoin(table_articles, eq(table_articles.id, table_tagsToArticles.article_id))
				.where(and(isNotNull(table_articles.publish_time), tagsCondition, timeCondition))
				.orderBy(desc(table_articles.publish_time))
				.groupBy(table_articles.id)
				.limit(ARTICLES_PER_SECTION);

		const articlesQueryForTitleTranslations = getBaselineOfArticlesQueryForTranslation(
			table_articles.title_translation_key
		);
		const articlesQueryForDescriptionTranslations = getBaselineOfArticlesQueryForTranslation(
			table_articles.description_translation_key
		);
		const articlesQueryAliased = articlesQuery.as('articles_sq');

		// 3. Tags articles query
		const tagsArticlesQuery = db
			.select({ tag_id: table_tagsToArticles.tag_id, article_id: table_tagsToArticles.article_id })
			.from(articlesQueryAliased)
			.innerJoin(table_tagsToArticles, eq(table_tagsToArticles.article_id, articlesQueryAliased.id))
			.innerJoin(table_tags, eq(table_tags.id, table_tagsToArticles.tag_id))
			.innerJoin(
				table_translations,
				and(
					eq(table_translations.key, table_tags.name_translation_key),
					isNotNull(table_translations[this.translationService.currentLang])
				)
			);
		const tagsArticlesQueryAliased = tagsArticlesQuery.as('tags_articles_sq');

		// 4. Tags
		const tagsQuery =
			actor?.username === config.username
				? db
						.select(getTableColumns(table_tags))
						.from(table_tags)
						.where(eq(table_tags.user_id, actor?.id))
				: db
						.select(getTableColumns(table_tags))
						.from(tagsArticlesQueryAliased)
						.innerJoin(table_tags, eq(table_tags.id, tagsArticlesQueryAliased.tag_id))
						.groupBy(table_tags.id);
		const tagsQueryForTranslations =
			actor?.username === config.username
				? db
						.select({ id: table_tags.name_translation_key })
						.from(table_tags)
						.where(eq(table_tags.user_id, actor?.id))
				: db
						.select({ id: table_tags.name_translation_key })
						.from(articlesQueryAliased)
						.innerJoin(
							table_tagsToArticles,
							eq(table_tagsToArticles.article_id, articlesQueryAliased.id)
						)
						.innerJoin(table_tags, eq(table_tags.id, table_tagsToArticles.tag_id))
						.innerJoin(
							table_translations,
							and(
								eq(table_translations.key, table_tags.name_translation_key),
								isNotNull(table_translations[this.translationService.currentLang])
							)
						);

		// 5. Description Translation query
		const descriptionTranslationQuery = db
			.select()
			.from(table_translations)
			.where(eq(table_translations.key, sectionInfo.title_translation_key))
			.limit(1);

		// 6. Preview types query
		const previewTypesQuery = db
			.select({ id: table_previewTemplates.id, url: table_previewTemplates.url })
			.from(articlesQueryAliased)
			.innerJoin(
				table_previewTemplates,
				eq(table_previewTemplates.id, articlesQueryAliased.preview_template_id)
			)
			.groupBy(table_previewTemplates.id);

		// 7. Preview Images query
		const previewImagesQuery = db
			.select(getTableColumns(table_images))
			.from(articlesQueryAliased)
			.innerJoin(
				table_images,
				or(
					eq(table_images.id, articlesQueryAliased.preview_image_1_id),
					eq(table_images.id, articlesQueryAliased.preview_image_2_id),
					eq(table_images.id, articlesQueryAliased.preview_screenshot_image_id)
				)
			);

		const previewImagesQueryForTranslations = db
			.select({ id: table_images.path_translation_key })
			.from(articlesQueryAliased)
			.innerJoin(
				table_images,
				or(
					eq(table_images.id, articlesQueryAliased.preview_image_1_id),
					eq(table_images.id, articlesQueryAliased.preview_image_2_id),
					eq(table_images.id, articlesQueryAliased.preview_screenshot_image_id)
				)
			);

		// 8. Other Translations query
		// TODO: This is the most row-reads heavy query in analytics
		const otherTranslationsQuery = db
			.select({
				key: table_translations.key,
				[this.translationService.currentLang]:
					table_translations[this.translationService.currentLang]
			})
			.from(table_translations)
			.where(
				and(
					or(
						inArray(table_translations.key, articlesQueryForTitleTranslations),
						inArray(table_translations.key, articlesQueryForDescriptionTranslations),
						inArray(table_translations.key, tagsQueryForTranslations),
						inArray(table_translations.key, previewImagesQueryForTranslations)
					),
					isNotNull(table_translations[this.translationService.currentLang])
				)
			)
			.groupBy(table_translations.key);

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
	async getOneQueryEngine(config: GetOneConfig) {
		const actor = await this.actorService.getOrThrow();

		// 1. Seciton filters
		const sectionWhere = [eq(table_sections.user_id, actor.id)];
		let sectionOffset = 0;

		if ('sectionId' in config) {
			sectionWhere.push(eq(table_sections.id, config.sectionId));
		}
		if ('pageId' in config) {
			sectionWhere.push(eq(table_sections.page_id, config.pageId));
			sectionOffset = config.offset;
		}

		// 2. Article filters

		const response = await db.query.sections.findFirst({
			where: and(...sectionWhere),
			offset: sectionOffset,
			with: { tags: true }
		});

		console.dir(response);

		return error(500, 'Not implemented');
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
					.insert(table_sectionsToTags)
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
				.delete(table_sectionsToTags)
				.where(eq(table_sectionsToTags.section_id, section_id))
				.run();
			if (uniqueTags.length) {
				await trx
					.insert(table_sectionsToTags)
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
				.delete(table_sectionsToTags)
				.where(and(eq(table_sectionsToTags.section_id, sectionDelete.section_id)))
				.run();
		});
	}
}
