import type { SupportedLang } from '@denlukia/plavna-common/types';
import { and, eq, isNotNull, notInArray, or, SQL } from 'drizzle-orm';
import { ARTICLES_PER_SECTION } from '$lib/collections/config';
import { db } from '$lib/services/db';

import { table_articles } from '../article/schema';
import { dedupeQueryResult, getTableColumnAliases } from '../common/drizzle';
import type { TranslationSelect } from '../i18n/parsers';
import { table_translations } from '../i18n/schema';
import type { RecordsTranslationsDict } from '../i18n/types';
import { table_images } from '../image/schema';
import type { ImagesDict } from '../image/types';
import { findExcludedTagsInReaderPageConfig } from '../page/utils';
import type { PreviewFamiliesDict } from '../preview/families/types';
import { table_tags, table_tagsToArticles } from '../tag/schema';
import type { Actor } from '../user/parsers';
import { table_sections, table_sectionsToTags } from './schema';
import type { GetOneSectionParams } from './types';

// 1. Description in this lang should be not null – DONE
// 2. Filter out articles with excluded tags – DONE
// 3. Give out forms only to actor

export async function queryGetOneSection(
	config: GetOneSectionParams,
	actor: Actor,
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

	const section = await db
		.select({ meta: table_sections, translation: table_translations })
		.from(table_sections)
		.innerJoin(table_translations, eq(table_translations.key, table_sections.title_translation_key))
		.where(and(...sectionWhere))
		.limit(1)
		.offset(sectionOffset)
		.get();

	if (!section) return null;

	// 2. + its Tags + TagsToArticles (filtered)
	const excludedTags = findExcludedTagsInReaderPageConfig(config.readerPageConfig, section.meta.id);
	const sectionAndTags = db
		.select({
			section_tags: getTableColumnAliases(table_tags),
			section_tags_to_articles: getTableColumnAliases(table_tagsToArticles),
			section_translations: getTableColumnAliases(table_translations)
		})
		.from(table_sectionsToTags)

		.innerJoin(table_tags, eq(table_tags.id, table_sectionsToTags.tag_id))
		.innerJoin(table_tagsToArticles, eq(table_tagsToArticles.tag_id, table_tags.id))
		.innerJoin(table_translations, eq(table_translations.key, table_tags.name_translation_key))
		.where(
			and(
				eq(table_sectionsToTags.section_id, section.meta.id),
				eq(table_sectionsToTags.lang, lang),
				notInArray(table_tags.id, excludedTags)
			)
		);

	const sectionAndTagsSq = db.$with('sectionAndTagsSq').as(sectionAndTags);

	// 3. + Articles (published)
	const tagsCondition = undefined; // TODO based on readerPageConfig (check if it's applied always)
	const articlesQuery = db
		.with(sectionAndTagsSq)
		.select({
			section_tags: sectionAndTagsSq.section_tags,
			section_translations: sectionAndTagsSq.section_translations,
			section_tags_to_articles: sectionAndTagsSq.section_tags_to_articles,
			articles: getTableColumnAliases(table_articles)
		})
		.from(sectionAndTagsSq)
		.innerJoin(
			table_articles,
			eq(table_articles.id, sectionAndTagsSq.section_tags_to_articles.article_id)
		)
		.where(and(isNotNull(table_articles.publish_time), tagsCondition))
		.offset(config.articlesOffset)
		.limit(ARTICLES_PER_SECTION);

	const articlesSq = db.$with('articlesSq').as(articlesQuery);

	// 4. + Images + Article Tags + Translations
	const articlesAndAll = db
		.with(articlesSq)
		.select({
			// We put them to 1st layer to be able to dedupe
			section_tags: articlesSq.section_tags,
			section_translations: articlesSq.section_translations,
			articles: articlesSq.articles,

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

	// 5. Transformations for return
	const activeTags = deduped.section_tags
		.map((t) => ({
			id: t.id
		}))
		.filter(({ id }) => !excludedTags.includes(id));

	const articles = deduped.articles.map((a) => ({
		meta: { ...a },
		tags: deduped.tags.filter((t) => deduped.tagsToArticles.some(({ tag_id }) => tag_id === t.id))
	}));

	let for_actor = null;
	if (actor.id === section.meta.user_id) {
		const foundTranslation = deduped.section_translations.find(
			(t) => t.key === section.meta.title_translation_key
		);
		if (!foundTranslation) {
			throw new Error('Translation not found');
		}
		for_actor = {
			title_translation: foundTranslation
		};
	}

	// TODO: Add records translations, previews families and images

	return {
		section: {
			meta: section.meta,
			activeTags: activeTags,
			articles: articles,
			for_actor: for_actor
		}
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
				preview_family: 'custom' | 'plavna-modern' | null;
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
		for_actor: {
			title_translation: TranslationSelect;
		} | null;
	};
	recordsTranslations: RecordsTranslationsDict;
	previewFamilies: PreviewFamiliesDict;
	images: ImagesDict;
} | null>;
