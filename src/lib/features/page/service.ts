import { error } from '@sveltejs/kit';
import { and, desc, eq, getTableColumns, inArray, isNotNull, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { POSTS_PER_SECTION, SECTIONS_PER_LOAD } from '$lib/collections/constants';
import { db } from '$lib/services/db';

import { articles } from '../article/schemas';
import { users } from '../auth/schemas';
import type { UserService } from '../auth/service';
import { translationInsertSchema, translationUpdateSchema } from '../i18n/parsers';
import { translations } from '../i18n/schemas';
import type { TranslationService } from '../i18n/service';
import { previewTemplates } from '../preview/schemas';
import { sections, sectionsToTags } from '../section/schemas';
import { tags, tagsToArticles } from '../tag/schemas';
import {
	pageCreationFormSchema,
	pageDeletionFormSchema,
	pageUpdatingFormSchema,
	type PageCreateForm,
	type PageSelect,
	type PageUpdateForm
} from './parsers';
import { pages } from './schemas';

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
		pageslug: string
		// excludedTags?: ExcludedTags
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

		const sectionsPromises = new Array(SECTIONS_PER_LOAD).fill(null).map((_, index) => {
			// 1. Sections query
			const sectionQueryForArticles = db
				.select(getTableColumns(sections))
				.from(sections)
				.innerJoin(translations, eq(translations.key, sections.title_translation_key))
				.where(
					and(
						eq(sections.page_id, pageIdSq.id),
						isNotNull(translations[this.translationService.currentLang])
					)
				)
				.limit(SECTIONS_PER_LOAD)
				.offset(index);
			const sectionQueryForTranslatins = db
				.select({ id: sections.title_translation_key })
				.from(sections)
				.innerJoin(translations, eq(translations.key, sections.title_translation_key))
				.where(
					and(
						eq(sections.page_id, pageIdSq.id),
						isNotNull(translations[this.translationService.currentLang])
					)
				)
				.limit(SECTIONS_PER_LOAD)
				.offset(index);
			const sectionQueryAliased = sectionQueryForArticles.as('section_sq');

			// 2. Articles query
			const translationForTag = alias(translations, 'translation_for_tag');
			const translationForArticle = alias(translations, 'translation_for_article');
			const articlesQuery = db
				.select(getTableColumns(articles))
				.from(sectionQueryAliased)
				.innerJoin(
					sectionsToTags,
					and(
						eq(sectionsToTags.section_id, sectionQueryAliased.id),
						eq(sectionsToTags.lang, this.translationService.currentLang)
					)
				)
				.innerJoin(tags, eq(tags.id, sectionsToTags.tag_id))
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
				.where(isNotNull(articles.publish_time))
				.orderBy(desc(articles.publish_time))
				.groupBy(articles.id)
				.limit(POSTS_PER_SECTION);
			const articlesQueryForTranslations = db
				.select({ id: articles.title_translation_key })
				.from(sectionQueryAliased)
				.innerJoin(
					sectionsToTags,
					and(
						eq(sectionsToTags.section_id, sectionQueryAliased.id),
						eq(sectionsToTags.lang, this.translationService.currentLang)
					)
				)
				.innerJoin(tags, eq(tags.id, sectionsToTags.tag_id))
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
				.where(isNotNull(articles.publish_time))
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
					? db.select({ tags }).from(tags).where(eq(tags.user_id, user?.id))
					: db
							.select({ tags })
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

			// 5. Sections Translations query
			const sectionsTranslationsQuery = db
				.select({ translations })
				.from(translations)
				.where(inArray(translations.key, sectionQueryForTranslatins))
				.groupBy(translations.key);

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

			const sectionInfo = sectionQueryForArticles.all();
			const articlesInfo = articlesQuery.all();
			const tagsArticlesInfo = tagsArticlesQuery.all();
			const tagsInfo = tagsQuery.all();
			const sectionsTranslationsInfo = sectionsTranslationsQuery.all();
			const otherTranslationsInfo = otherTranslationsQuery.all();
			const previewTypesInfo = allPreviewTypesQuery.all();

			return Promise.all([
				sectionInfo,
				articlesInfo,
				tagsArticlesInfo,
				tagsInfo,
				sectionsTranslationsInfo,
				otherTranslationsInfo,
				previewTypesInfo
			]);
		});
		const sectionsResponses = await Promise.all(sectionsPromises);
		const sectionsNonEmpty = sectionsResponses.filter((res) => res[0].length);

		const descriptionFormsPromises = sectionsNonEmpty.map(
			async ([, , , , sectionsTranslationsInfo]) => {
				const translationsPromises = sectionsTranslationsInfo.map(async (t) => {
					if (user?.username === username) {
						return [
							t.translations.key,
							await superValidate(t.translations, zod(translationUpdateSchema), {
								id: 'section-translation-' + t.translations.key
							})
						];
					} else {
						return [t.translations.key, t.translations[this.translationService.currentLang]];
					}
				});
				return await Promise.all(translationsPromises);
			}
		);
		const descriptionFormsArr = await Promise.all(descriptionFormsPromises);
		const descriptionForms = Object.fromEntries(descriptionFormsArr.flat());

		return {
			sections: sectionsNonEmpty.map(([sectionInfo, articlesInfo, tagsArticlesInfo]) => {
				return { meta: sectionInfo[0], articles: articlesInfo, tagsArticles: tagsArticlesInfo };
			}),
			tags: sectionsNonEmpty.reduce((acc, [, , , tagsInfo]) => {
				return {
					...acc,
					...Object.fromEntries(tagsInfo.map((t) => [t.tags.id, t]))
				};
			}, {}),
			descriptionForms,
			recordsTranslations: {
				...sectionsNonEmpty.reduce(
					(acc, [, , , , , otherTranslationsInfo]) => {
						return {
							...acc,
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
			}, {}),
			sectionCreationForm: await superValidate(zod(translationInsertSchema))
		};
	}
}
