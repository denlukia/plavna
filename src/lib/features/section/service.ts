import { supportedLangs } from '@denlukia/plavna-common/constants';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import { error } from '@sveltejs/kit';
import { and, desc, eq, getTableColumns, inArray, isNotNull, notInArray, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { marked } from 'marked';
import { POSTS_PER_SECTION } from '$lib/collections/constants';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import { articles } from '../article/schema';
import type { UserService } from '../auth/service';
import { isNonNullable } from '../common/utils';
import { translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { PageSelect, ReaderPageConfig } from '../page/parsers';
import { pages } from '../page/schema';
import { findExcludedTagsInReaderPageConfig } from '../page/utils';
import { previewTemplates } from '../preview/schema';
import type { TagUpdate } from '../tag/parsers';
import { tags, tagsToArticles } from '../tag/schema';
import type { SectionDelete, SectionInsert, SectionSelect, SectionUpdate } from './parsers';
import { sections, sectionsToTags } from './schema';
import { findTagIdsInLinks } from './utils';

type GetOneConfig = { username: string } & (
	| { pageId: PageSelect['id']; offset: number }
	| { sectionId: SectionSelect['id']; readerPageConfig: ReaderPageConfig }
);

export class SectionService {
	private readonly userService: UserService;
	private readonly translationService: TranslationService;

	constructor(userService: UserService, translationService: TranslationService) {
		this.userService = userService;
		this.translationService = translationService;
	}

	async getOne(config: GetOneConfig) {
		const whereCondition =
			'pageId' in config ? eq(sections.page_id, config.pageId) : eq(sections.id, config.sectionId);
		const offset = 'offset' in config ? config.offset : 0;

		const user = await this.userService.get();

		// 1. Sections query
		const sectionInfo = await db
			.select(getTableColumns(sections))
			.from(sections)
			.innerJoin(translations, eq(translations.key, sections.title_translation_key))
			.where(and(whereCondition, isNotNull(translations[this.translationService.currentLang])))
			.limit(1)
			.offset(offset)
			.get();

		if (!sectionInfo) return;

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
			user?.username === config.username
				? db.select(getTableColumns(tags)).from(tags).where(eq(tags.user_id, user?.id))
				: db
						.select(getTableColumns(tags))
						.from(tagsArticlesQueryAliased)
						.innerJoin(tags, eq(tags.id, tagsArticlesQueryAliased.tag_id))
						.groupBy(tags.id);
		const tagsQueryForTranslations =
			user?.username === config.username
				? db.select({ id: tags.name_translation_key }).from(tags).where(eq(tags.user_id, user?.id))
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

		const responses = await Promise.all([
			sectionInfo,
			activeTagsInfo,
			articlesInfo,
			tagsArticlesInfo,
			tagsInfo,
			descriptionTranslationInfo,
			otherTranslationsInfo,
			previewTypesInfo
		]);

		// TODO: Move here composing of section object away from page service
		// return { section: {}, recordsTranslations: {}, previewTypes: {} };

		return responses;
	}
	async create(pagename: string, section: SectionInsert) {
		const user = await this.userService.getOrThrow();
		const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

		supportedLangs.forEach((lang) => {
			const translationText = section[lang];
			if (isNonNullable(translationText)) {
				const tokens = marked.lexer(translationText);
				const thisLangTags = findTagIdsInLinks(tokens);
				foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
			}
		});

		await db.transaction(async (trx) => {
			const translationForRecord = { ...section, user_id: user.id };
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
		const { section_id, ...langsTranslations } = sectionUpdate;
		const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

		supportedLangs.forEach((lang) => {
			const translationText = langsTranslations[lang];
			if (isNonNullable(translationText)) {
				const tokens = marked.lexer(translationText);
				const thisLangTags = findTagIdsInLinks(tokens);
				foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
			}
		});

		// Tag ownership check
		if (foundTags.length) {
			const foundUnique = [...new Set(foundTags.map((tag) => tag.tag_id))];
			const existingForUser = await db
				.select({ tag_id: tags.id })
				.from(tags)
				.where(and(inArray(tags.id, foundUnique), eq(tags.user_id, user.id)))
				.all();
			if (existingForUser.length !== foundUnique.length) {
				error(403, ERRORS.SOME_TAGS_DONT_EXIST);
			}
		}

		// Getting translation id
		const translation = await db
			.select({ key: translations.key })
			.from(sections)
			.innerJoin(translations, eq(sections.title_translation_key, translations.key))
			.where(and(eq(sections.id, section_id), eq(sections.user_id, user.id)))
			.get();
		if (!translation) {
			error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
		}

		await db.transaction(async (trx) => {
			await this.translationService.update({ ...langsTranslations, key: translation.key }, trx);

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
				.where(and(eq(sections.id, sectionDelete.section_id), eq(sections.user_id, user.id)))
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
