import { page } from '$app/stores';
import { POSTS_PER_SECTION, SECTIONS_PER_LOAD } from '../../isomorphic/constants';
import { db } from './db';
import { error } from '@sveltejs/kit';
import {
	type ExtractTablesWithRelations,
	and,
	desc,
	eq,
	exists,
	gte,
	inArray,
	isNotNull,
	isNull,
	lt,
	lte,
	notExists,
	or,
	sql
} from 'drizzle-orm';
import { type SQLiteTransaction, alias } from 'drizzle-orm/sqlite-core';
import { marked, use } from 'marked';
import { superValidateSync } from 'sveltekit-superforms/server';

import {
	type SupportedLang,
	defaultLang,
	isSupportedLang,
	supportedLanguages
} from '$lib/isomorphic/languages';
import { findTagIdsInLinks } from '$lib/isomorphic/utils';
import {
	pages,
	articles,
	previewTypes,
	sections,
	sectionsToTags,
	tags,
	tagsToArticles,
	translations,
	users
} from '$lib/server/collections/db-schema';
import { ERRORS } from '$lib/server/collections/errors';
import {
	pageCreateFormSchema,
	pageSelectSchema,
	pageUpdateFormSchema,
	articlePreviewUpdateSchema,
	articleSelectWithoutPreviewValuesSchema,
	articleSlugUpdateSchema,
	articleUpdateSchema,
	sectionInsertSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema,
	translationUpdateSchema
} from '$lib/server/collections/parsers';
import {
	removeNullAndDup as getNullAndDupFilter,
	hasNonEmptyProperties,
	nonNull
} from '$lib/server/utils/objects';

import type {
	ExcludedTags,
	PageCreateForm,
	PageInsert,
	PageSelect,
	PageUpdateForm,
	ArticleInsert,
	ArticlePreviewUpdate,
	ArticleSelect,
	ArticleSlugUpdate,
	PreviewTypeSelect,
	SectionDelete,
	SectionSelect,
	SectionToTagInsert,
	SectionUpdate,
	TagDelete,
	TagToArticleSelect,
	TagSelect,
	TagUpdate,
	TranslationDelete,
	TranslationInsert,
	TranslationSelect,
	TranslationUpdate
} from '$lib/server/collections/types';
import type { User } from '../collections/types';
import type { ResultSet } from '@libsql/client';
import type { AuthRequest } from 'lucia';

type TransactionContext = SQLiteTransaction<
	'async',
	ResultSet,
	typeof import('$lib/server/collections/db-schema'),
	ExtractTablesWithRelations<typeof import('$lib/server/collections/db-schema')>
>;

class Plavna {
	private readonly authRequest: AuthRequest;
	private readonly lang: SupportedLang;

	constructor(authRequest: AuthRequest, langParam: string | undefined) {
		this.authRequest = authRequest;
		if (!langParam) {
			this.lang = defaultLang;
		} else if (isSupportedLang(langParam)) {
			this.lang = langParam;
		} else {
			throw error(404);
		}
	}

	private readonly user = {
		get: async () => {
			const session = await this.authRequest.validate();
			return session && session.user;
		},
		getOrThrow: async () => {
			const user = await this.user.get();
			if (user === null) throw error(403);
			return user;
		},
		checkOrThrow: async (id: User['id'] | null, username?: User['username']) => {
			const user = await this.user.get();
			if (user === null) throw error(403);
			if (id && user?.id !== id) throw error(403);
			if (username && user?.username !== username) throw error(403);
			return user;
		}
	};

	public readonly pages = {
		create: async (page: PageCreateForm) => {
			const user = await this.user.getOrThrow();
			return db
				.insert(pages)
				.values({ ...page, user_id: user.id })
				.run();
		},
		update: async (page: PageUpdateForm) => {
			const user = await this.user.getOrThrow();
			return db
				.update(pages)
				.set(page)
				.where(and(eq(pages.id, page.id), eq(pages.user_id, user.id)))
				.run();
		},
		delete: async (id: PageSelect['id']) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(pages)
				.where(and(eq(pages.id, id), eq(pages.user_id, user.id)))
				.run();
		},
		getMyAsForms: async (username: string) => {
			const user = await this.user.checkOrThrow(null, username);
			const query = await db.select().from(pages).where(eq(pages.user_id, user.id)).all();

			return {
				editForms: query.map((page) =>
					superValidateSync(page, pageUpdateFormSchema, { id: 'pages-' + page.id })
				),
				createForm: superValidateSync(pageCreateFormSchema)
			};
		},
		getOneWithSectionsAndArticles: async (
			username: string,
			pagename: string,
			excludedTags?: ExcludedTags
		) => {
			const user = await this.user.get();
			const sectionsPromises = new Array(SECTIONS_PER_LOAD).fill(null).map((_, index) => {
				// TODO Currently I see no way of DRYing with keeping good types

				// 1. Sections query
				const userIdSq = db
					.select({ id: users.id })
					.from(users)
					.where(eq(users.username, username));
				const pageIdSq = db
					.select()
					.from(pages)
					.where(and(eq(pages.slug, pagename), eq(pages.user_id, userIdSq)))
					.as('page_sq');

				const {
					$inferInsert: $inferInsertSections,
					$inferSelect: $inferSelectSections,
					_: sectionsMeta,
					...sectionsFields
				} = sections;
				const sectionQueryForArticles = db
					.select({ ...sectionsFields })
					.from(pageIdSq)
					.innerJoin(sections, eq(sections.page_id, pageIdSq.id))
					.innerJoin(translations, eq(translations.key, sections.title_translation_id))
					.where(isNotNull(translations[this.lang]))
					.limit(SECTIONS_PER_LOAD)
					.offset(index);
				const sectionQueryForTranslatins = db
					.select({ id: sections.title_translation_id })
					.from(pageIdSq)
					.innerJoin(sections, eq(sections.page_id, pageIdSq.id))
					.innerJoin(translations, eq(translations.key, sections.title_translation_id))
					.where(isNotNull(translations[this.lang]))
					.limit(SECTIONS_PER_LOAD)
					.offset(index);
				const sectionQueryAliased = sectionQueryForArticles.as('section_sq');

				// 2. Articles query
				const {
					$inferInsert: $inferInsertArticles,
					$inferSelect: $inferSelectArticles,
					_: articlesMeta,
					...articlesFields
				} = articles;
				const translationForTag = alias(translations, 'translation_for_tag');
				const translationForArticle = alias(translations, 'translation_for_article');
				const articlesQuery = db
					.select({ ...articlesFields })
					.from(sectionQueryAliased)
					.innerJoin(
						sectionsToTags,
						and(
							eq(sectionsToTags.section_id, sectionQueryAliased.id),
							eq(sectionsToTags.lang, this.lang)
						)
					)
					.innerJoin(tags, eq(tags.id, sectionsToTags.tag_id))
					.innerJoin(tagsToArticles, eq(tagsToArticles.tag_id, tags.id))
					.innerJoin(articles, eq(articles.id, tagsToArticles.article_id))
					.innerJoin(
						translationForTag,
						and(
							eq(translationForTag.key, tags.name_translation_id),
							isNotNull(translationForTag[this.lang])
						)
					)
					.innerJoin(
						translationForArticle,
						and(
							eq(translationForArticle.key, articles.title_translation_id),
							isNotNull(translationForArticle[this.lang])
						)
					)
					.where(isNotNull(articles.published_at))
					.orderBy(desc(articles.published_at))
					.groupBy(articles.id)
					.limit(POSTS_PER_SECTION);
				const articlesQueryForTranslations = db
					.select({ id: articles.title_translation_id })
					.from(sectionQueryAliased)
					.innerJoin(
						sectionsToTags,
						and(
							eq(sectionsToTags.section_id, sectionQueryAliased.id),
							eq(sectionsToTags.lang, this.lang)
						)
					)
					.innerJoin(tags, eq(tags.id, sectionsToTags.tag_id))
					.innerJoin(tagsToArticles, eq(tagsToArticles.tag_id, tags.id))
					.innerJoin(articles, eq(articles.id, tagsToArticles.article_id))
					.innerJoin(
						translationForTag,
						and(
							eq(translationForTag.key, tags.name_translation_id),
							isNotNull(translationForTag[this.lang])
						)
					)
					.innerJoin(
						translationForArticle,
						and(
							eq(translationForArticle.key, articles.title_translation_id),
							isNotNull(translationForArticle[this.lang])
						)
					)
					.where(isNotNull(articles.published_at))
					.orderBy(desc(articles.published_at))
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
						and(eq(translations.key, tags.name_translation_id), isNotNull(translations[this.lang]))
					);
				const tagsArticlesQueryAliased = tagsArticlesQuery.as('tags_articles_sq');

				// 4. Tags
				const {
					$inferInsert: $inferInsertTags,
					$inferSelect: $inferSelectTags,
					_: tagsMeta,
					...tagsFields
				} = tags;

				const tagsQuery =
					user?.username === username
						? db
								.select({ ...tagsFields })
								.from(tags)
								.where(eq(tags.user_id, user?.id))
						: db
								.select({ ...tagsFields })
								.from(tagsArticlesQueryAliased)
								.innerJoin(tags, eq(tags.id, tagsArticlesQueryAliased.tag_id))
								.groupBy(tags.id);
				const tagsQueryForTranslations =
					user?.username === username
						? db
								.select({ id: tags.name_translation_id })
								.from(tags)
								.where(eq(tags.user_id, user?.id))
						: db
								.select({ id: tags.name_translation_id })
								.from(articlesQueryAliased)
								.innerJoin(tagsToArticles, eq(tagsToArticles.article_id, articlesQueryAliased.id))
								.innerJoin(tags, eq(tags.id, tagsToArticles.tag_id))
								.innerJoin(
									translations,
									and(
										eq(translations.key, tags.name_translation_id),
										isNotNull(translations[this.lang])
									)
								);

				// 5. Sections Translations query
				const {
					$inferInsert: $inferInsertTranslations,
					$inferSelect: $inferSelectTranslations,
					_: translationsMeta,
					...translationsFields
				} = translations;
				const sectionsTranslationsQuery = db
					.select({ ...translationsFields })
					.from(translations)
					.where(inArray(translations.key, sectionQueryForTranslatins))
					.groupBy(translations.key);

				// 6. Other Translations query
				const otherTranslationsQuery = db
					.select({ key: translations.key, [this.lang]: translations[this.lang] })
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
					.select({ id: previewTypes.id, component_reference: previewTypes.url })
					.from(articlesQueryAliased)
					.innerJoin(previewTypes, eq(previewTypes.id, articlesQueryAliased.preview_type_id))
					.groupBy(previewTypes.id);

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

			return {
				sections: sectionsNonEmpty.map(([sectionInfo, articlesInfo, tagsArticlesInfo]) => {
					return { meta: sectionInfo[0], articles: articlesInfo, tagsArticles: tagsArticlesInfo };
				}),
				tags: sectionsNonEmpty.reduce((acc, [a, b, c, tagsInfo]) => {
					return {
						...acc,
						...Object.fromEntries(tagsInfo.map((t) => [t.id, t]))
					};
				}, {}),
				translations: {
					...sectionsNonEmpty.reduce((acc, [a, b, c, d, sectionsTranslationsInfo]) => {
						return {
							...acc,
							...Object.fromEntries(
								sectionsTranslationsInfo.map((t) => {
									if (user?.username === username) {
										return [
											t.key,
											superValidateSync(t, translationUpdateSchema, {
												id: 'section-translation-' + t.key
											})
										];
									} else {
										return [t.key, t[this.lang]];
									}
								})
							)
						};
					}, {}),
					...sectionsNonEmpty.reduce((acc, [a, b, c, d, e, otherTranslationsInfo]) => {
						return {
							...acc,
							...Object.fromEntries(
								otherTranslationsInfo.map((t) => {
									return [t.key, t[this.lang]];
								})
							)
						};
					}, {})
				},
				previewTypes: sectionsNonEmpty.reduce((acc, [a, b, c, d, e, f, previewTypesInfo]) => {
					return {
						...acc,
						...Object.fromEntries(
							previewTypesInfo.map((p) => {
								return [p.id, { component_reference: p.component_reference }];
							})
						)
					};
				}, {}),
				sectionCreationForm: superValidateSync(translationInsertSchema)
			};
		}
	};

	public readonly articles = {
		getIdIfExists: async (slug: ArticleSelect['slug']) => {
			const article = await db
				.select({ id: articles.id })
				.from(articles)
				.where(eq(articles.slug, slug))
				.get();
			if (article) {
				return article.id;
			} else {
				return null;
			}
		},
		createFromSlug: async (slug: ArticleInsert['slug']) => {
			const user = await this.user.getOrThrow();
			return db.transaction(async (trx) => {
				const newTranslation = {
					user_id: user.id
				};
				const [{ key: title_translation_id }, { key: content_translation_id }] =
					await this.translations.create(
						[newTranslation, newTranslation],
						'allow-empty',
						trx,
						user
					);
				const article = await trx
					.insert(articles)
					.values({
						user_id: user.id,
						slug: slug,
						title_translation_id: Number(title_translation_id),
						content_translation_id: Number(content_translation_id)
					})
					.returning({ id: articles.id })
					.get();
				return article.id;
			});
		},
		createAndOrLoadEditor: async (username: User['username'], slug: ArticleSelect['slug']) => {
			const user = await this.user.checkOrThrow(null, username);

			let exisingId = await this.articles.getIdIfExists(slug);
			if (exisingId === null) {
				exisingId = await this.articles.createFromSlug(slug);
			}

			const translForForms = alias(translations, 'translForForms');
			const query = await db
				.select({
					articles: articles,
					tagsArticles: tagsToArticles,
					tags,
					translations: { key: translations.key, [this.lang]: translations[this.lang] },
					translForForms,
					previewTypes
				})
				.from(articles)
				.leftJoin(previewTypes, or(eq(previewTypes.user_id, user.id), isNull(previewTypes.user_id)))
				.leftJoin(tags, eq(tags.user_id, user.id))
				.leftJoin(translations, eq(translations.key, previewTypes.name_translation_id))
				.leftJoin(
					translForForms,
					or(
						eq(translForForms.key, articles.content_translation_id),
						eq(translForForms.key, articles.title_translation_id),
						eq(translForForms.key, tags.name_translation_id)
					)
				)
				.leftJoin(tagsToArticles, eq(tagsToArticles.article_id, exisingId))
				.where(eq(articles.id, exisingId))
				.all();

			const previewsArr = query.map((rows) => rows.previewTypes).filter(getNullAndDupFilter('id'));
			const allTags = query.map((rows) => rows.tags).filter(getNullAndDupFilter('id'));
			const articleTags = query
				.map((rows) => rows.tagsArticles)
				.filter(getNullAndDupFilter('tag_id'));
			const translArr = query.map((rows) => rows.translations).filter(getNullAndDupFilter('key'));
			const translForms = query
				.map(({ translForForms: t }) => t)
				.filter(getNullAndDupFilter('key'));
			const tagForms = allTags.map((tag) => ({
				isCheckedForm: superValidateSync(
					{ ...tag, checked: !!articleTags.find((t) => t.tag_id === tag.id) },
					tagUpdateSchema,
					{ id: 'is-checked-' + tag.id }
				),
				name_translation_id: tag.name_translation_id,
				deletionForm: superValidateSync({ id: tag.id }, tagDeleteSchema, {
					id: 'deletion-' + tag.id
				})
			}));

			return {
				article: articleSelectWithoutPreviewValuesSchema.parse(query[0].articles),
				articleSlugForm: superValidateSync(query[0].articles, articleSlugUpdateSchema),
				articleForm: superValidateSync(query[0].articles, articleUpdateSchema),
				articlePreviewForm: superValidateSync(query[0].articles, articlePreviewUpdateSchema),
				previews: previewsArr,
				tagForms,
				tagCreationForm: superValidateSync(translationInsertSchema),
				translations: Object.fromEntries([
					...translForms.map((translation) => {
						const { key, ...other } = translation;
						return [
							key,
							superValidateSync(translation, translationUpdateSchema, { id: 'translation-' + key })
						];
					}),
					...translArr.map((translation) => [translation.key, translation[this.lang]])
				])
			};
		},
		updateSlug: async (slug: string, article: ArticleSlugUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(articles)
				.set(article)
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))
				.returning({ slug: articles.slug })
				.get();
		},
		publish: async (slug: string) => {
			const user = await this.user.getOrThrow();
			return db
				.update(articles)
				.set({ published_at: new Date() })
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))
				.returning({ slug: articles.slug })
				.get();
		},
		hide: async (slug: string) => {
			const user = await this.user.getOrThrow();
			return db
				.update(articles)
				.set({ published_at: null })
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))
				.returning({ slug: articles.slug })
				.get();
		},
		delete: async (slug: string) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(articles)
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))
				.run();
		},
		updatePreview: async (slug: string, preview: ArticlePreviewUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(articles)
				.set(preview)
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))
				.returning({ slug: articles.slug })
				.get();
		},
		getOne: async (username: string, slug: string) => {
			const userPromise = this.user.get();
			const titleTranslationAlias = alias(translations, 'title_translation');
			const queryPromise = db
				.select({
					articles: articles,
					titleTranslationAlias,
					translations: { key: translations.key, [this.lang]: translations[this.lang] },
					previewTypes,
					tags
				})
				.from(articles)
				.innerJoin(users, eq(users.id, articles.user_id))
				.leftJoin(previewTypes, eq(previewTypes.id, articles.preview_type_id))
				.leftJoin(tagsToArticles, eq(tagsToArticles.article_id, articles.id))
				.leftJoin(tags, eq(tags.id, tagsToArticles.tag_id))
				.leftJoin(
					titleTranslationAlias,
					eq(titleTranslationAlias.key, articles.title_translation_id)
				)
				.leftJoin(
					translations,
					or(
						eq(translations.key, articles.content_translation_id),
						eq(translations.key, tags.name_translation_id)
					)
				)
				.where(
					and(
						eq(users.username, username),
						eq(articles.slug, slug),
						isNotNull(titleTranslationAlias[this.lang])
					)
				)
				.all();

			const [query, user] = await Promise.all([queryPromise, userPromise]);

			if (!query.length) {
				throw error(404);
			}
			if ((!user || user.username !== username) && query[0].articles.published_at === null) {
				throw error(404);
			}
			return {
				article: query[0].articles,
				previewType: query[0].previewTypes,
				translations: Object.fromEntries([
					...query
						.map((row) => row.translations)
						.filter(getNullAndDupFilter('key'))
						.map((row) => [row.key, row[this.lang]]),
					...query
						.map((row) => row.titleTranslationAlias)
						.filter(getNullAndDupFilter('key'))
						.map((row) => [row.key, row[this.lang]])
				]),
				tags: query.map((rows) => rows.tags).filter(getNullAndDupFilter('id'))
			};
		}
	};

	public readonly sections = {
		create: async (pagename: string, translation: TranslationInsert) => {
			const user = await this.user.getOrThrow();
			const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

			supportedLanguages.forEach((lang) => {
				const translationText = translation[lang];
				if (nonNull(translationText)) {
					const tokens = marked.lexer(translationText, { mangle: false, headerIds: false });
					const thisLangTags = findTagIdsInLinks(tokens);
					foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
				}
			});

			await db.transaction(async (trx) => {
				const translationForRecord = { ...translation, user_id: user.id };
				const [createdTranslation] = await this.translations.create(
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
					throw error(403, ERRORS.NO_SUCH_PAGE_TO_CREATE_POST_ON);
				}
				const { page_id } = page;
				const { section_id } = await trx
					.insert(sections)
					.values({ user_id: user.id, page_id, title_translation_id: createdTranslation.key })
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
						throw error(403, ERRORS.SOME_TAGS_DONT_EXIST);
					}

					await trx
						.insert(sectionsToTags)
						.values(foundTags.map((tag) => ({ ...tag, section_id })))
						.run();
				}
			});
		},
		update: async (sectionUpdate: SectionUpdate) => {
			const user = await this.user.getOrThrow();
			const { section_id, ...translation } = sectionUpdate;
			const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

			supportedLanguages.forEach((lang) => {
				const translationText = translation[lang];
				if (nonNull(translationText)) {
					const tokens = marked.lexer(translationText, { mangle: false, headerIds: false });
					const thisLangTags = findTagIdsInLinks(tokens);
					foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
				}
			});

			await db.transaction(async (trx) => {
				await this.translations.update(translation, trx);

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
						throw error(403, ERRORS.SOME_TAGS_DONT_EXIST);
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
		},
		// TODO Remake all delete params to just id
		delete: async (sectionDelete: SectionDelete) => {
			const user = await this.user.getOrThrow();

			await db.transaction(async (trx) => {
				const translation = await trx
					.select({ title_translation_id: sections.title_translation_id })
					.from(sections)
					.where(and(eq(sections.id, sectionDelete.id), eq(sections.user_id, user.id)))
					.get();
				if (!translation) {
					throw error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
				}
				const { title_translation_id } = translation;
				await this.translations.delete({ key: title_translation_id }, trx);
				await trx
					.delete(sectionsToTags)
					.where(and(eq(sectionsToTags.section_id, sectionDelete.id)))
					.run();
			});
		}
	};

	public readonly tags = {
		create: async (translation: TranslationInsert) => {
			const user = await this.user.getOrThrow();
			return db.transaction(async (trx) => {
				const [{ key }] = await this.translations.create(
					[translation],
					'disallow-empty',
					trx,
					user
				);
				return trx
					.insert(tags)
					.values({ name_translation_id: key, user_id: user.id })
					.returning()
					.get();
			});
		},
		delete: async (tag: TagDelete) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(tags)
				.where(and(eq(tags.id, tag.id), eq(tags.user_id, user.id)))
				.run();
		},
		switchChecked: async (tag: TagUpdate, slug: string) => {
			const user = await this.user.getOrThrow();
			const currentlyChecked = tag.checked;
			const articleSql = sql`${db
				.select({ id: articles.id })
				.from(articles)
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))}`;
			const tagSql = sql`${db
				.select({ id: tags.id })
				.from(tags)
				.where(and(eq(tags.id, tag.id), eq(tags.user_id, user.id)))}`;

			if (currentlyChecked) {
				const result = await db
					.delete(tagsToArticles)
					.where(and(eq(tagsToArticles.tag_id, tagSql), eq(tagsToArticles.article_id, articleSql)))
					.run();
			} else {
				const result = await db
					.insert(tagsToArticles)
					.values({ tag_id: tagSql, article_id: articleSql })
					.run();
			}
		}
	};

	public readonly translations = {
		create: async (
			newTranslations: TranslationInsert[],
			mode: 'allow-empty' | 'disallow-empty',
			trx?: TransactionContext,
			user?: User
		) => {
			if (mode === 'disallow-empty') {
				newTranslations.forEach((translation) => {
					if (!hasNonEmptyProperties(translation, ['user_id', 'key'])) {
						throw error(403, ERRORS.AT_LEAST_ONE_TRANSLATION);
					}
				});
			}
			if (user === undefined) {
				user = await this.user.getOrThrow();
			}
			if (user) {
				const userCopy = user;
				newTranslations = newTranslations.map((translation) => ({
					...translation,
					// It only sees that user is not empty via copy and
					// I'm not in the mood for such a plain type guard
					user_id: userCopy.id
				}));
			}
			const chosenDBInstance = trx || db;
			return chosenDBInstance
				.insert(translations)
				.values(newTranslations)
				.returning({ key: translations.key })
				.all();
		},
		update: async (translation: TranslationUpdate, trx?: TransactionContext) => {
			const user = await this.user.getOrThrow();
			const chosenDBInstance = trx || db;
			console.log('updating_translation to', translation, user);
			return chosenDBInstance
				.update(translations)
				.set(translation)
				.where(and(eq(translations.key, translation.key), eq(translations.user_id, user.id)))
				.run();
		},
		delete: async (translation: TranslationDelete, trx?: TransactionContext) => {
			const user = await this.user.getOrThrow();
			const chosenDBInstance = trx || db;
			return chosenDBInstance
				.delete(translations)
				.where(and(eq(translations.key, translation.key), eq(translations.user_id, user.id)))
				.run();
		}
	};
}
export default Plavna;

export type PlavnaService = typeof Plavna;
