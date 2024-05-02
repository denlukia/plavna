import { error } from '@sveltejs/kit';
import { and, desc, eq, getTableColumns, inArray, isNotNull, notInArray, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { POSTS_PER_SECTION, SECTIONS_PER_LOAD } from '$lib/collections/constants';
import { db } from '$lib/services/db';

import type { ArticleSelect } from '../article/parsers';
import { articles } from '../article/schema';
import { users } from '../auth/schema';
import type { UserService } from '../auth/service';
import { isNonNullable } from '../common/utils';
import { translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import { previewTemplates } from '../preview/schema';
import { sectionDeleteSchema, sectionInsertSchema, sectionUpdateSchema } from '../section/parsers';
import { sections, sectionsToTags } from '../section/schema';
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
import { findExcludedTagsInReaderPageConfig } from './utils';

export class PageService {
	private readonly userService: UserService;
	private readonly translationService: TranslationService;

	constructor(userService: UserService, translationService: TranslationService) {
		this.userService = userService;
		this.translationService = translationService;
	}

	async create(page: PageCreateForm) {
		const user = await this.userService.getOrThrow();
		return db
			.insert(pages)
			.values({ ...page, user_id: user.id })
			.run();
	}
	async update(page: PageUpdateForm) {
		const user = await this.userService.getOrThrow();
		return db
			.update(pages)
			.set(page)
			.where(and(eq(pages.id, page.id), eq(pages.user_id, user.id)))
			.run();
	}
	async delete(id: PageSelect['id']) {
		const user = await this.userService.getOrThrow();
		return db
			.delete(pages)
			.where(and(eq(pages.id, id), eq(pages.user_id, user.id)))
			.run();
	}
	async getMyAsForms(username: string) {
		const user = await this.userService.checkOrThrow(null, username);
		const query = await db.select().from(pages).where(eq(pages.user_id, user.id)).all();
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
	// TODO Currently I see no way of DRYing with keeping good types
	async getOneWithSectionsAndArticles(
		username: string,
		pageslug: string,
		readerPageConfig: ReaderPageConfig
	) {
		const user = await this.userService.get();

		// 0. Utilitary queries
		const userIdSq = db.select({ id: users.id }).from(users).where(eq(users.username, username));
		const pageIdSq = await db
			.select()
			.from(pages)
			.where(and(eq(pages.slug, pageslug), eq(pages.user_id, userIdSq)))
			.get();

		if (!pageIdSq) {
			return error(404);
		}

		const sectionsPromises = new Array(SECTIONS_PER_LOAD).fill(null).map(async (_, index) => {
			// 1. Sections query
			const sectionInfo = await db
				.select(getTableColumns(sections))
				.from(sections)
				.innerJoin(translations, eq(translations.key, sections.title_translation_key))
				.where(
					and(
						eq(sections.page_id, pageIdSq.id),
						isNotNull(translations[this.translationService.currentLang])
					)
				)
				.limit(1)
				.offset(index)
				.get();

			if (!sectionInfo) return;

			// 1.5. Active tags query
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

			const articlesQueryForTranslations = db
				.select({ id: articles.title_translation_key })
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
				user?.username === username
					? db.select(getTableColumns(tags)).from(tags).where(eq(tags.user_id, user?.id))
					: db
							.select(getTableColumns(tags))
							.from(tagsArticlesQueryAliased)
							.innerJoin(tags, eq(tags.id, tagsArticlesQueryAliased.tag_id))
							.groupBy(tags.id);
			const tagsQueryForTranslations =
				user?.username === username
					? db
							.select({ id: tags.name_translation_key })
							.from(tags)
							.where(eq(tags.user_id, user?.id))
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

			// 6. Other Translations query
			const otherTranslationsQuery = db
				.select({
					key: translations.key,
					[this.translationService.currentLang]: translations[this.translationService.currentLang]
				})
				.from(translations)
				.where(
					or(
						inArray(translations.key, articlesQueryForTranslations),
						inArray(translations.key, tagsQueryForTranslations)
					)
				)
				.groupBy(translations.key);

			// 6. Preview types query
			const allPreviewTypesQuery = db
				.select({ id: previewTemplates.id, component_reference: previewTemplates.url })
				.from(articlesQueryAliased)
				.innerJoin(
					previewTemplates,
					eq(previewTemplates.id, articlesQueryAliased.preview_template_id)
				)
				.groupBy(previewTemplates.id);

			const activeTagsInfo = activeTagsQuery.all();
			const articlesInfo = articlesQuery.all();
			const tagsArticlesInfo = tagsArticlesQuery.all();
			const tagsInfo = tagsQuery.all();
			const descriptionTranslationInfo = descriptionTranslationQuery.get();
			const otherTranslationsInfo = otherTranslationsQuery.all();
			const previewTypesInfo = allPreviewTypesQuery.all();

			return Promise.all([
				sectionInfo,
				activeTagsInfo,
				articlesInfo,
				tagsArticlesInfo,
				tagsInfo,
				descriptionTranslationInfo,
				otherTranslationsInfo,
				previewTypesInfo
			]);
		});
		const sectionsResponses = await Promise.all(sectionsPromises);

		const sectionsNonEmpty = sectionsResponses
			.map((section) => {
				if (!section) return null;
				const [sectionInfo, ...other] = section;
				return isNonNullable(sectionInfo) ? ([sectionInfo, ...other] as const) : null;
			})
			.filter(isNonNullable);

		type SectionInfo = (typeof sectionsNonEmpty)[number][0];
		type DescriptionTranslationInfo = (typeof sectionsNonEmpty)[number][5];

		const canAddForms = user?.username === username;

		const getSectionForms = async (sectionInfo: SectionInfo, t: DescriptionTranslationInfo) => {
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

		const getArticleWithTags = (
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

		return {
			sections: {
				items: await Promise.all(
					sectionsNonEmpty.map(
						async ([
							sectionInfo,
							activeTagsInfo,
							articlesInfo,
							tagsArticlesInfo,
							tagsInfo,
							descriptionTranslationInfo
						]) => {
							return {
								meta: sectionInfo,
								activeTags: activeTagsInfo,
								articles: articlesInfo.map((article) =>
									getArticleWithTags(article, tagsArticlesInfo, tagsInfo)
								),
								forms: await getSectionForms(sectionInfo, descriptionTranslationInfo)
							};
						}
					)
				),
				creationForm: canAddForms ? await superValidate(zod(sectionInsertSchema)) : null
			},
			recordsTranslations: {
				...sectionsNonEmpty.reduce(
					(acc, [, , , , , descriptionTranslationInfo, otherTranslationsInfo]) => {
						if (!descriptionTranslationInfo) throw error(500, 'Translation for section not found');
						const descriptionTranslation = {
							[descriptionTranslationInfo.key]:
								descriptionTranslationInfo[this.translationService.currentLang]
						};
						return {
							...acc,
							...descriptionTranslation,
							...Object.fromEntries(
								otherTranslationsInfo.map((t) => {
									return [t.key, t[this.translationService.currentLang]];
								})
							)
						};
					},
					{} as Record<string, string | number | null>
				)
			},
			previewTypes: sectionsNonEmpty.reduce((acc, [, , , , , , previewTypesInfo]) => {
				return {
					...acc,
					...Object.fromEntries(
						previewTypesInfo.map((p) => {
							return [p.id, { component_reference: p.component_reference }];
						})
					)
				};
			}, {})
		};
	}
}
