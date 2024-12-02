import type { SupportedLang } from '@denlukia/plavna-common/types';
import {
	and,
	desc,
	eq,
	getTableColumns,
	inArray,
	isNotNull,
	lte,
	notInArray,
	or,
	sql,
	SQL
} from 'drizzle-orm';
import { ARTICLES_PER_SECTION } from '$lib/collections/config';
import { db } from '$lib/services/db';

import { table_articles } from '../article/schema';
import { dedupeQueryResult, getTableColumnAliases } from '../common/drizzle';
import { isNonNullable } from '../common/utils';
import { table_translations } from '../i18n/schema';
import type { RecordsTranslationsDict } from '../i18n/types';
import type { TranslationSelect } from '../i18n/validators';
import { table_images } from '../image/schema';
import type { ImagesDict } from '../image/types';
import { table_pages } from '../page/schema';
import { findExcludedTagsInReaderPageConfig } from '../page/utils';
import type { PageSelect } from '../page/validators';
import type { PreviewFamilyId } from '../preview/families/types';
import { table_tags, table_tags_to_articles } from '../tag/schema';
import type { Actor } from '../user/validators';
import { table_sections, table_sections_to_tags } from './schema';
import type { GetOneSectionParams } from './types';

// 1. Description in this lang should be not null – DONE
// 2. Filter out articles with excluded tags – DONE
// 3. Give out actor related data only to actor

export async function queryGetOneSection(
	config: GetOneSectionParams,
	actor: Actor | null,
	lang: SupportedLang
): GetOneOldReturn {
	// 1. Section + Decription translation
	const sectionWhere: SQL[] = [];
	let sectionOffset = 0;

	if ('sectionId' in config) {
		sectionWhere.push(eq(table_sections.id, config.sectionId));
	}
	if ('pageId' in config) {
		sectionWhere.push(eq(table_sections.page_id, config.pageId));
		sectionOffset = config.sectionOffset;
	}

	sectionWhere.push(isNotNull(table_translations[lang]));

	const sectionAndTranslation = await db
		.select({ meta: table_sections, translation: table_translations })
		.from(table_sections)
		.innerJoin(table_translations, eq(table_translations.key, table_sections.title_translation_key))
		.where(and(...sectionWhere))
		.offset(sectionOffset)
		.limit(1)
		.get();

	if (!sectionAndTranslation) return null;
	if (!sectionAndTranslation.translation[lang]) {
		return null;
	}

	// 2. + its Tags + TagsToArticles (filtered)
	const excludedTags = findExcludedTagsInReaderPageConfig(
		config.readerPageConfig,
		sectionAndTranslation.meta.id
	);
	const sectionAndTagsQuery = db
		.select({
			section_tags: getTableColumnAliases(table_tags),
			section_tags_to_articles: getTableColumnAliases(table_tags_to_articles),
			section_translations: getTableColumnAliases(table_translations)
		})
		.from(table_sections_to_tags)
		.innerJoin(table_tags, eq(table_tags.id, table_sections_to_tags.tag_id))
		.leftJoin(
			table_tags_to_articles,
			and(
				eq(table_tags_to_articles.tag_id, table_tags.id),
				notInArray(table_tags_to_articles.tag_id, excludedTags)
			)
		)
		.innerJoin(table_translations, eq(table_translations.key, table_tags.name_translation_key))
		.where(
			and(
				eq(table_sections_to_tags.section_id, sectionAndTranslation.meta.id),
				eq(table_sections_to_tags.lang, lang)
			)
		);
	const sectionAndTags = await sectionAndTagsQuery;
	const dedupedSectionAndTags = dedupeQueryResult(sectionAndTagsQuery, sectionAndTags);

	const articleIdsForSearch = dedupedSectionAndTags.section_tags_to_articles.map(
		(x) => x.article_id
	);

	// 3. + Articles (only published, offsetted if needed)
	const currentTime = new Date();
	const articlesOffset = 'articlesOffset' in config ? config.articlesOffset : 0;
	const articlesQuery = db
		.select({
			articles: getTableColumns(table_articles)
		})
		.from(table_articles)
		.where(
			and(
				inArray(table_articles.id, articleIdsForSearch),
				isNotNull(table_articles.publish_time),
				lte(table_articles.publish_time, currentTime)
			)
		)
		.orderBy(desc(table_articles.publish_time))
		.offset(articlesOffset)
		.limit(ARTICLES_PER_SECTION);

	const articlesSq = db.$with('articlesSq').as(articlesQuery);

	// 4. + Images + Article Tags + Translations
	// TODO: Add preview templates info
	const articlesAndAllQuery = db
		.with(articlesSq)
		.select({
			// We put them to 1st layer to be able to dedupe
			articles: articlesSq.articles,

			images: table_images,
			tagsToArticles: table_tags_to_articles,
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
		.innerJoin(
			table_tags_to_articles,
			eq(table_tags_to_articles.article_id, articlesSq.articles.id)
		)
		.innerJoin(table_tags, eq(table_tags.id, table_tags_to_articles.tag_id))
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

	const articlesAndAll = await articlesAndAllQuery;
	const dedupedArticlesAndAll = dedupeQueryResult(articlesAndAllQuery, articlesAndAll, {
		translations: (a, b) => a.key === b.key
	});

	// 5. Transformations for return
	const activeTags = dedupedSectionAndTags.section_tags
		.map((t) => ({
			id: t.id
		}))
		.filter(({ id }) => !excludedTags.includes(id));

	const articlesArr = dedupedArticlesAndAll?.articles || [];
	const articles = articlesArr.map((a) => ({
		meta: { ...a },
		tags: dedupedArticlesAndAll.tags
			.sort((a, b) => b.id - a.id)
			.filter((t) =>
				dedupedArticlesAndAll.tagsToArticles.some(
					({ tag_id, article_id }) => tag_id === t.id && article_id === a.id
				)
			)
	}));

	const title_translation = sectionAndTranslation.translation;

	const recordsTranslations = [
		title_translation,
		...dedupedSectionAndTags.section_translations,
		...dedupedArticlesAndAll.translations
	].reduce<RecordsTranslationsDict>((acc, t) => {
		const translation = t && t[lang];
		if (translation) {
			acc[t.key] = translation;
		}
		return acc;
	}, {});

	const previewFamilyIds = dedupedArticlesAndAll.articles
		.map((a) => a.preview_family)
		.filter(isNonNullable);

	const images = dedupedArticlesAndAll.images.reduce<ImagesDict>((acc, i) => {
		const { id, ...other } = i;
		acc[id] = other;
		return acc;
	}, {});

	return {
		section: {
			meta: sectionAndTranslation.meta,
			activeTags: activeTags,
			articles: articles,
			title_translation: title_translation
		},
		recordsTranslations: recordsTranslations,
		previewFamilyIds: previewFamilyIds,
		images: images
	};
}

type GetOneOldReturn = Promise<{
	section: {
		meta: {
			id: number;
			page_id: number;
			user_id: string;
			title_translation_key: number;
		};
		activeTags: {
			id: number;
		}[];
		articles: {
			meta: {
				id: number;
				user_id: string;
				slug: string;
				title_translation_key: number;
				description_translation_key: number;
				content_translation_key: number;
				publish_time: Date | null;
				likes_count: number;
				preview_columns: number;
				preview_rows: number;
				preview_family: 'custom' | 'modern' | 'sequences' | null;
				preview_template_id: number | null;
				preview_interactions_show_on: 'hover' | 'click' | null;
				preview_prop_1: string | null;
				preview_prop_2: string | null;
				preview_translation_1_key: number;
				preview_translation_2_key: number;
				preview_image_1_id: number;
				preview_image_2_id: number;
				preview_create_localized_screenshots: boolean;
				preview_screenshot_image_id: number | null;
			};
			tags: {
				id: number;
				user_id: string;
				name_translation_key: number;
			}[];
		}[];
		title_translation: TranslationSelect | null;
	};
	recordsTranslations: RecordsTranslationsDict;
	previewFamilyIds: Array<PreviewFamilyId>;
	images: ImagesDict;
} | null>;

export async function queryGetSectionsQuantity(pagename: PageSelect['slug'], actorId: Actor['id']) {
	return db
		.select({ count: sql<number>`count(*)` })
		.from(table_pages)
		.innerJoin(table_sections, eq(table_sections.id, table_pages.id))
		.where(and(eq(table_pages.slug, pagename), eq(table_pages.user_id, actorId)))
		.get();
}
