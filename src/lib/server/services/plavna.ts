import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { error, fail } from '@sveltejs/kit';
import {
	type ExtractTablesWithRelations,
	and,
	desc,
	eq,
	inArray,
	isNotNull,
	or,
	sql
} from 'drizzle-orm';
import { type SQLiteTransaction, alias } from 'drizzle-orm/sqlite-core';
import { marked } from 'marked';
import { superValidateSync } from 'sveltekit-superforms/server';

import { ERRORS } from '$lib/isomorphic/errors';
import {
	type SupportedLang,
	defaultLang,
	isSupportedLang,
	supportedLangs
} from '$lib/isomorphic/languages';
import { findTagIdsInLinks } from '$lib/isomorphic/utils';
import {
	articles,
	images,
	pages,
	previewTemplates,
	screenshotsQueue,
	sections,
	sectionsToTags,
	tags,
	tagsToArticles,
	translations,
	users
} from '$lib/server/collections/db-schema';
import {
	articlePreviewUpdateSchema,
	articleSelectSchema,
	articleSlugUpdateSchema,
	imageCreationFormSchema,
	imageProviderUpdateFormSchema,
	imageUpdateFormSchema,
	pageCreateFormSchema,
	pageUpdateFormSchema,
	previewTemplateCreationFormSchema,
	previewTemplateEditingFormSchema,
	tagUpdateSchema,
	translationInsertSchema,
	translationUpdateSchema
} from '$lib/server/collections/parsers';
import { getNullAndDupFilter, hasNonEmptyProperties, nonNull } from '$lib/server/helpers/objects';

import { POSTS_PER_SECTION, SECTIONS_PER_LOAD } from '../../isomorphic/constants';
import { previewFamilies } from '../collections/previews';
import { decomposeImageField } from '../helpers/images';
import {
	calculateDimensionsFromCellsTaken,
	composeURLForScreenshot,
	getMaybeTranslatedImagePath
} from '../helpers/screenshotting';
import { db } from './db';

import type {
	ArticleInsert,
	ArticlePreviewImageFileFieldNamesAll,
	ArticlePreviewImageHandlers,
	ArticlePreviewUpdate,
	ArticleSelect,
	ArticleSlugUpdate,
	ImageInsert,
	ImageProdiverUpdate,
	ImageSelect,
	ImageUpdate,
	PageCreateForm,
	PageSelect,
	PageUpdateForm,
	PreviewTemplateCreation,
	PreviewTemplateDeletion,
	PreviewTemplateEditing,
	ScreenshotsQueueInsertLocal,
	SectionDelete,
	SectionUpdate,
	TagDelete,
	TagUpdate,
	TranslationDelete,
	TranslationInsert,
	TranslationInsertBase,
	TranslationSelect,
	TranslationUpdate,
	TranslationUpdateZod
} from '$lib/server/collections/types';
import type { User } from '../collections/types';
import type { ResultSet } from '@libsql/client';
import type { AuthRequest } from 'lucia';
import type { SuperValidated } from 'sveltekit-superforms';

type TransactionContext = SQLiteTransaction<
	'async',
	ResultSet,
	typeof import('$lib/server/collections/db-schema'),
	ExtractTablesWithRelations<typeof import('$lib/server/collections/db-schema')>
>;

type ImageAnyParams = {
	lang: SupportedLang | null;
	user: User;
	trx?: TransactionContext;
};
type ImageCreationParams = {
	mode: 'create';
	initialImage: ImageInsert;
};
type ImagesUpdateParams = {
	mode: 'update';
	initialImage: ImageUpdate;
};

// TODO Probably replace all error() with fail() ?

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

	public readonly user = {
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
		},
		updateImageProvider: async (providerData: ImageProdiverUpdate) => {
			const user = await this.user.getOrThrow();
			await new ServerImageHandler(null).setUploaderFromUser(providerData);
			return db.update(users).set(providerData).where(eq(users.id, user.id));
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
			pagename: string
			// excludedTags?: ExcludedTags
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

				const sectionQueryForArticles = db
					.select(sections._.columns)
					.from(pageIdSq)
					.innerJoin(sections, eq(sections.page_id, pageIdSq.id))
					.innerJoin(translations, eq(translations.key, sections.title_translation_key))
					.where(isNotNull(translations[this.lang]))
					.limit(SECTIONS_PER_LOAD)
					.offset(index);
				const sectionQueryForTranslatins = db
					.select({ id: sections.title_translation_key })
					.from(pageIdSq)
					.innerJoin(sections, eq(sections.page_id, pageIdSq.id))
					.innerJoin(translations, eq(translations.key, sections.title_translation_key))
					.where(isNotNull(translations[this.lang]))
					.limit(SECTIONS_PER_LOAD)
					.offset(index);
				const sectionQueryAliased = sectionQueryForArticles.as('section_sq');

				// 2. Articles query
				const translationForTag = alias(translations, 'translation_for_tag');
				const translationForArticle = alias(translations, 'translation_for_article');
				const articlesQuery = db
					.select(articles._.columns)
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
							eq(translationForTag.key, tags.name_translation_key),
							isNotNull(translationForTag[this.lang])
						)
					)
					.innerJoin(
						translationForArticle,
						and(
							eq(translationForArticle.key, articles.title_translation_key),
							isNotNull(translationForArticle[this.lang])
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
							eq(sectionsToTags.lang, this.lang)
						)
					)
					.innerJoin(tags, eq(tags.id, sectionsToTags.tag_id))
					.innerJoin(tagsToArticles, eq(tagsToArticles.tag_id, tags.id))
					.innerJoin(articles, eq(articles.id, tagsToArticles.article_id))
					.innerJoin(
						translationForTag,
						and(
							eq(translationForTag.key, tags.name_translation_key),
							isNotNull(translationForTag[this.lang])
						)
					)
					.innerJoin(
						translationForArticle,
						and(
							eq(translationForArticle.key, articles.title_translation_key),
							isNotNull(translationForArticle[this.lang])
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
						and(eq(translations.key, tags.name_translation_key), isNotNull(translations[this.lang]))
					);
				const tagsArticlesQueryAliased = tagsArticlesQuery.as('tags_articles_sq');

				// 4. Tags
				const tagsQuery =
					user?.username === username
						? db
								.select(tags._.columns)
								.from(tags)
								.where(eq(tags.user_id, user?.id))
						: db
								.select(tags._.columns)
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
										isNotNull(translations[this.lang])
									)
								);

				// 5. Sections Translations query
				const sectionsTranslationsQuery = db
					.select(translations._.columns)
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

			return {
				sections: sectionsNonEmpty.map(([sectionInfo, articlesInfo, tagsArticlesInfo]) => {
					return { meta: sectionInfo[0], articles: articlesInfo, tagsArticles: tagsArticlesInfo };
				}),
				tags: sectionsNonEmpty.reduce((acc, [, , , tagsInfo]) => {
					return {
						...acc,
						...Object.fromEntries(tagsInfo.map((t) => [t.id, t]))
					};
				}, {}),
				translationForms: {
					...(sectionsNonEmpty.reduce((acc, [, , , , sectionsTranslationsInfo]) => {
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
					}, {}) as Record<string, SuperValidated<TranslationUpdateZod>>)
				},
				translations: {
					...sectionsNonEmpty.reduce((acc, [, , , , , otherTranslationsInfo]) => {
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
				sectionCreationForm: superValidateSync(translationInsertSchema)
			};
		}
	};

	public readonly sections = {
		create: async (pagename: string, translation: TranslationInsert) => {
			const user = await this.user.getOrThrow();
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

			supportedLangs.forEach((lang) => {
				const translationText = translation[lang];
				if (nonNull(translationText)) {
					const tokens = marked.lexer(translationText);
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
					.select({ title_translation_key: sections.title_translation_key })
					.from(sections)
					.where(and(eq(sections.id, sectionDelete.id), eq(sections.user_id, user.id)))
					.get();
				if (!translation) {
					throw error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
				}
				const { title_translation_key } = translation;
				await this.translations.delete({ key: title_translation_key }, trx);
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
				const [{ key }] = await this.translations.create([translation], 'disallow-empty', trx);
				return trx
					.insert(tags)
					.values({ name_translation_key: key, user_id: user.id })
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
				await db
					.delete(tagsToArticles)
					.where(and(eq(tagsToArticles.tag_id, tagSql), eq(tagsToArticles.article_id, articleSql)))
					.run();
			} else {
				await db.insert(tagsToArticles).values({ tag_id: tagSql, article_id: articleSql }).run();
			}
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
				const [
					{ key: title_translation_key },
					{ key: content_translation_key },
					{ key: preview_translation_1_key },
					{ key: preview_translation_2_key }
				] = await this.translations.create(new Array(4).fill(newTranslation), 'allow-empty', trx);
				const { source } = await new ServerImageHandler(null).setUploaderFromUser(user);
				const [{ id: preview_image_1_id }, { id: preview_image_2_id }] = await Promise.all([
					this.images.create({ source }, trx),
					this.images.create({ source }, trx)
				]);

				const article = await trx
					.insert(articles)
					.values({
						user_id: user.id,
						slug: slug,
						title_translation_key: Number(title_translation_key),
						content_translation_key: Number(content_translation_key),
						preview_family: 'plavna-modern',
						preview_translation_1_key,
						preview_translation_2_key,
						preview_image_1_id,
						preview_image_2_id
					})
					.returning({ id: articles.id })
					.get();

				return article.id;
			});
		},
		loadEditor: async (username: User['username'], slug: ArticleSelect['slug']) => {
			const user = await this.user.checkOrThrow(null, username);

			let exisingId = await this.articles.getIdIfExists(slug);
			if (exisingId === null) {
				exisingId = await this.articles.createFromSlug(slug);
			}

			const translForForms = alias(translations, 'translForForms');
			const translForPreviewTemplates = alias(translations, 'translForPreviewTemplates');
			const commonImagesTable = alias(images, 'commonImages');
			const articleImagesTable = alias(images, 'articleImages');
			const results = await db
				.select({
					articles: articles,
					tagsArticles: tagsToArticles,
					tags,
					translations,
					translForForms,
					translForPreviewTemplates,
					previewTemplates,
					images,
					commonImagesTable,
					articleImagesTable
				})
				.from(articles)
				.leftJoin(previewTemplates, eq(previewTemplates.user_id, user.id))
				.leftJoin(
					images,
					or(
						eq(images.id, previewTemplates.image_id),
						eq(images.id, articles.preview_image_1_id),
						eq(images.id, articles.preview_image_2_id)
					)
				)
				.leftJoin(
					commonImagesTable,
					and(eq(commonImagesTable.user_id, user.id), eq(commonImagesTable.is_account_common, true))
				)
				.leftJoin(
					articleImagesTable,
					and(
						eq(articleImagesTable.user_id, user.id),
						eq(articleImagesTable.owning_article_id, exisingId)
					)
				)
				.leftJoin(tags, eq(tags.user_id, user.id))
				.leftJoin(translations, eq(translations.key, images.path_translation_key))
				.leftJoin(
					translForPreviewTemplates,
					eq(translForPreviewTemplates.key, previewTemplates.name_translation_key)
				)
				.leftJoin(
					translForForms,
					or(
						eq(translForForms.key, articles.content_translation_key),
						eq(translForForms.key, articles.title_translation_key),
						eq(translForForms.key, tags.name_translation_key),
						eq(translForForms.key, articles.preview_translation_1_key),
						eq(translForForms.key, articles.preview_translation_2_key)
					)
				)
				.leftJoin(tagsToArticles, eq(tagsToArticles.article_id, exisingId))
				.where(eq(articles.id, exisingId))
				.all();

			const articleResult = results[0].articles;
			const translationsArr = results
				.map((rows) => rows.translations)
				.filter(getNullAndDupFilter('key'));
			const translationsForPreviewTemplates = results
				.map((rows) => rows.translForPreviewTemplates)
				.filter(getNullAndDupFilter('key'));
			const imagesArr = results.map((rows) => rows.images).filter(getNullAndDupFilter('id'));
			const previewTemplatesResults = results
				.map((rows) => rows.previewTemplates)
				.filter(getNullAndDupFilter('id'))
				.map((template) => {
					const foundTranslation = translationsForPreviewTemplates.find(
						(translation) => translation.key === template.name_translation_key
					);

					return {
						meta: template,
						form: superValidateSync(
							{ ...template, template_id: template.id, ...foundTranslation },
							previewTemplateEditingFormSchema
						)
					};
				});
			const allTags = results.map((rows) => rows.tags).filter(getNullAndDupFilter('id'));
			const articleTags = results
				.map((rows) => rows.tagsArticles)
				.filter(getNullAndDupFilter('tag_id'));
			const translationsForForms = results
				.map((rows) => rows.translForForms)
				.filter(getNullAndDupFilter('key'));
			const tagInfos = allTags.map((tag) => ({
				checkedForm: superValidateSync(
					{ ...tag, checked: !!articleTags.find((t) => t.tag_id === tag.id) },
					tagUpdateSchema,
					{ id: 'is-checked-' + tag.id }
				),
				name_translation_key: tag.name_translation_key
			}));
			const previewForms = [...previewFamilies, ...previewTemplatesResults].map(
				(familyOrTemplate) => {
					const emptyForm = superValidateSync(articlePreviewUpdateSchema);
					const filledForm = superValidateSync(articleResult, articlePreviewUpdateSchema);
					if ('meta' in familyOrTemplate) {
						return {
							familyId: 'custom',
							templateId: familyOrTemplate.meta.id,
							propsForm:
								articleResult.preview_family === 'custom' &&
								articleResult.preview_template_id === familyOrTemplate.meta.id
									? filledForm
									: emptyForm
						};
					} else {
						return {
							familyId: familyOrTemplate.id,
							templateId: null,
							propsForm:
								articleResult.preview_family === familyOrTemplate.id &&
								articleResult.preview_template_id === null
									? filledForm
									: emptyForm
						};
					}
				}
			);
			const commonImages = {
				creation: superValidateSync(imageCreationFormSchema, { id: 'common-image-creation' }),
				items: results
					.map((rows) => rows.commonImagesTable)
					.filter(getNullAndDupFilter('id'))
					.map((image) => ({
						meta: image,
						form: superValidateSync(image, imageUpdateFormSchema, { id: 'image-' + image.id })
					}))
			};
			const articleImages = {
				creation: superValidateSync(imageCreationFormSchema, { id: 'article-image-creation' }),
				items: results
					.map((rows) => rows.articleImagesTable)
					.filter(getNullAndDupFilter('id'))
					.map((image) => ({
						meta: image,
						form: superValidateSync(image, imageUpdateFormSchema, { id: 'image-' + image.id })
					}))
			};

			return {
				meta: articleSelectSchema.parse(articleResult),
				slugForm: superValidateSync(articleResult, articleSlugUpdateSchema),
				previewForms,
				previewFamilies,
				previewTemplates: previewTemplatesResults,
				previewTemplateCreationForm: superValidateSync(previewTemplateCreationFormSchema),
				tagInfos,
				tagCreationForm: superValidateSync(translationInsertSchema),
				imageProviderForm: superValidateSync(user, imageProviderUpdateFormSchema),
				images: imagesArr,
				commonImages,
				articleImages,
				translations: Object.fromEntries(
					translationsArr.map((translation) => {
						return [translation.key, translation[this.lang]];
					})
				),
				translationForms: Object.fromEntries(
					translationsForForms.map((translation) => {
						const { key } = translation;
						return [
							key,
							superValidateSync(translation, translationUpdateSchema, {
								id: 'translation-' + key
							})
						];
					})
				)
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
				.set({ publish_time: new Date() })
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))
				.returning({ slug: articles.slug })
				.get();
		},
		hide: async (slug: string) => {
			const user = await this.user.getOrThrow();
			return db
				.update(articles)
				.set({ publish_time: null })
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
		updatePreview: async (
			slug: string,
			preview: ArticlePreviewUpdate,
			imageHandlers: ArticlePreviewImageHandlers
		) => {
			// Common for 1. and 3.
			const user = await this.user.getOrThrow();
			const { source, providerData: imageProviderData } = await new ServerImageHandler(
				null
			).setUploaderFromUser(user);

			// 1. Article fields update
			if (preview.preview_family && preview.preview_family !== 'custom')
				preview.preview_template_id = null;
			if (preview.preview_template_id) preview.preview_family = 'custom';

			const whereCondition = and(eq(articles.slug, slug), eq(articles.user_id, user.id));
			const articleUpdatePromise = db.update(articles).set(preview).where(whereCondition).run();
			const promisesToWaitFor: Promise<ResultSet | void>[] = [articleUpdatePromise];

			// 2. Upload images if present and update records
			const validImagesPresent = Object.values(imageHandlers).some(
				({ hasValidImage }) => hasValidImage
			);
			if (validImagesPresent) {
				const queryResult = await db
					.select({
						preview_image_1_id: articles.preview_image_1_id,
						preview_image_2_id: articles.preview_image_2_id
					})
					.from(articles)
					.where(whereCondition)
					.all();
				const articleRecord = queryResult[0];

				if (!queryResult) throw error(500);
				Object.entries(imageHandlers).forEach(async ([fieldName, imageHandler]) => {
					const fieldNameTyped = fieldName as ArticlePreviewImageFileFieldNamesAll;
					const { fieldNameWithIdPrefix, lang } = decomposeImageField(fieldNameTyped);
					if (imageHandler.hasValidImage) {
						await imageHandler.setUploaderFromUser(user);
						const record = await imageHandler.processAndUpload({
							imageId: articleRecord[fieldNameWithIdPrefix],
							lang
						});
						await this.images.update(record.record, lang);
					}
				});
			}

			// 3. Enqueue preview screenshots if needed
			if (preview.preview_family === 'custom' && preview.preview_template_id) {
				const articleResult = await db
					.select({
						articles,
						images,
						translations,
						previewTemplateUrl: previewTemplates.url
					})
					.from(articles)
					.innerJoin(previewTemplates, eq(previewTemplates.id, preview.preview_template_id))
					.leftJoin(
						images,
						or(
							eq(images.id, articles.preview_image_1_id),
							eq(images.id, articles.preview_image_2_id)
						)
					)
					.leftJoin(
						translations,
						or(
							eq(translations.key, articles.preview_translation_1_key),
							eq(translations.key, articles.preview_translation_2_key),
							eq(translations.key, images.path_translation_key),
							eq(translations.key, articles.title_translation_key)
						)
					)
					.where(whereCondition)
					.all();

				if (articleResult) {
					const { previewTemplateUrl } = articleResult[0];
					const {
						preview_columns,
						preview_rows,
						preview_translation_1_key,
						preview_translation_2_key,
						preview_image_1_id,
						preview_image_2_id,
						title_translation_key
					} = articleResult[0].articles;
					let { preview_screenshot_image_id } = articleResult[0].articles;

					const imagesArr = articleResult
						.map(({ images }) => images)
						.filter(getNullAndDupFilter('id'));
					const translationsArr = articleResult
						.map(({ translations }) => translations)
						.filter(getNullAndDupFilter('key'));

					const preview_translation_1 =
						translationsArr.find((t) => t.key === preview_translation_1_key)?.[this.lang] || '';
					const preview_translation_2 =
						translationsArr.find((t) => t.key === preview_translation_2_key)?.[this.lang] || '';
					const titleTranslationObj = translationsArr.find((t) => t.key === title_translation_key);

					const { width, height } = calculateDimensionsFromCellsTaken({
						preview_columns,
						preview_rows
					});
					const preview_image_1 = getMaybeTranslatedImagePath(
						imagesArr,
						translationsArr,
						preview_image_1_id,
						this.lang
					);
					const preview_image_2 = getMaybeTranslatedImagePath(
						imagesArr,
						translationsArr,
						preview_image_2_id,
						this.lang
					);
					const url = composeURLForScreenshot(previewTemplateUrl, {
						width,
						height,
						lang: this.lang,
						preview_prop_1: preview.preview_prop_1 || null,
						preview_prop_2: preview.preview_prop_2 || null,
						preview_translation_1,
						preview_translation_2,
						preview_image_1,
						preview_image_2
					});

					// Creating screenshot image record if needed
					if (!preview_screenshot_image_id) {
						const newImageRecord = await this.images.create({ source });
						preview_screenshot_image_id = newImageRecord.id;
						await db
							.update(articles)
							.set({ preview_screenshot_image_id: newImageRecord.id })
							.where(whereCondition);
					}

					if (preview_screenshot_image_id) {
						const image_id = preview_screenshot_image_id;
						let queueRecordsForInsert: Array<ScreenshotsQueueInsertLocal> = [];
						if (preview.preview_create_localized_screenshots) {
							queueRecordsForInsert = supportedLangs
								.map((lang) => {
									if (titleTranslationObj?.[lang]) {
										return {
											image_id,
											width,
											height,
											lang,
											url,
											imageProviderData
										};
									} else {
										return null;
									}
								})
								.filter(nonNull);
							if (queueRecordsForInsert.length === 0) {
								return fail(403, { message: ERRORS.AT_LEAST_ONE_TITLE });
							}
						} else {
							queueRecordsForInsert = [
								{
									image_id,
									width,
									height,
									url,
									imageProviderData
								}
							];
						}

						const queueRecordsInserPromise = db
							.insert(screenshotsQueue)
							.values(queueRecordsForInsert)
							.run();
						promisesToWaitFor.push(queueRecordsInserPromise);
					}
				}
			} else {
				// Delete any queues and images
			}
			return Promise.all(promisesToWaitFor);
		},
		getOne: async (username: string, slug: string) => {
			const userPromise = this.user.get();
			const titleTranslationAlias = alias(translations, 'title_translation');
			const queryPromise = db
				.select({
					articles: articles,
					titleTranslationAlias,
					translations: { key: translations.key, [this.lang]: translations[this.lang] },
					previewTypes: previewTemplates,
					tags
				})
				.from(articles)
				.innerJoin(users, eq(users.id, articles.user_id))
				.leftJoin(previewTemplates, eq(previewTemplates.id, articles.preview_template_id))
				.leftJoin(tagsToArticles, eq(tagsToArticles.article_id, articles.id))
				.leftJoin(tags, eq(tags.id, tagsToArticles.tag_id))
				.leftJoin(
					titleTranslationAlias,
					eq(titleTranslationAlias.key, articles.title_translation_key)
				)
				.leftJoin(
					translations,
					or(
						eq(translations.key, articles.content_translation_key),
						eq(translations.key, tags.name_translation_key)
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
			if ((!user || user.username !== username) && query[0].articles.publish_time === null) {
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

	public readonly previewTemplates = {
		// TODO Show image input only if account has imagekit keys
		create: async (template: PreviewTemplateCreation, imageHandler: ServerImageHandler) => {
			const user = await this.user.getOrThrow();
			const { url, ...translation } = template;
			await db.transaction(async (trx) => {
				const [{ key }] = await this.translations.create([translation], 'disallow-empty', trx);
				let imageId: ImageSelect['id'] | null = null;
				if (imageHandler.hasValidImage) {
					const { source } = await imageHandler.setUploaderFromUser(user);
					({ id: imageId } = await this.images.create({ source }, trx));
					const { record } = await imageHandler.processAndUpload({ imageId, lang: null });
					await this.images.update(record, null, trx);
				}
				await trx
					.insert(previewTemplates)
					.values({ user_id: user.id, url, name_translation_key: key, image_id: imageId })
					.run();
			});
		},
		update: async (template: PreviewTemplateEditing, imageHandler: ServerImageHandler) => {
			const user = await this.user.getOrThrow();
			const { url, template_id, ...translation } = template;
			await db.transaction(async (trx) => {
				const whereCondition = and(
					eq(previewTemplates.id, template_id),
					eq(previewTemplates.user_id, user.id)
				);

				// 1. Update name translation and URL
				const translationResult = await trx
					.select({ key: translations.key })
					.from(previewTemplates)
					.innerJoin(translations, eq(translations.key, previewTemplates.name_translation_key))
					.where(whereCondition)
					.get();
				if (!translationResult) {
					throw error(403, ERRORS.PREVIEW_TEMPLATE_NOT_FOUND);
				}

				await this.translations.update({ ...translation, key: translationResult.key }, trx);
				await trx.update(previewTemplates).set({ url }).where(whereCondition);

				// 2. Create/Upload/Update image
				if (imageHandler.hasValidImage) {
					const imageResult = await trx
						.select({ id: images.id })
						.from(previewTemplates)
						.innerJoin(images, eq(images.id, previewTemplates.image_id))
						.where(whereCondition)
						.get();
					const { source } = await imageHandler.setUploaderFromUser(user);

					let imageId: ImageSelect['id'] | undefined = imageResult?.id;
					if (!imageId) {
						({ id: imageId } = await this.images.create({ source }, trx));
						await trx.update(previewTemplates).set({ image_id: imageId }).where(whereCondition);
					}
					const { record } = await imageHandler.processAndUpload({ imageId, lang: null });
					await this.images.update(record, null, trx);
				}
			});
		},
		delete: async (template: PreviewTemplateDeletion) => {
			const user = await this.user.getOrThrow();
			await db.transaction(async (trx) => {
				const whereCondition = and(
					eq(previewTemplates.id, template.id),
					eq(previewTemplates.user_id, user.id)
				);
				const recordResult = await trx
					.select({ translation_key: translations.key, images })
					.from(previewTemplates)
					.innerJoin(translations, eq(translations.key, previewTemplates.name_translation_key))
					.innerJoin(images, eq(images.id, previewTemplates.image_id))
					.where(whereCondition)
					.get();
				if (recordResult?.translation_key) {
					await this.translations.delete({ key: recordResult.translation_key }, trx);
					await trx
						.update(articles)
						.set({ preview_family: null })
						.where(eq(articles.preview_template_id, template.id));
				} else {
					throw error(403, ERRORS.PREVIEW_TEMPLATE_NOT_FOUND);
				}
				if (recordResult) {
					if (recordResult.images.path) {
						// TODO Folder deletion
					}
					await this.images.delete(recordResult.images.id, trx);
				}
				await trx.delete(previewTemplates).where(whereCondition).run();
			});
		}
	};

	private readonly imagesCommon = async ({
		initialImage,
		mode,
		lang,
		user,
		trx
	}: ImageAnyParams & (ImageCreationParams | ImagesUpdateParams)) => {
		const chosenDBInstance = trx || db;
		const initialImageId = initialImage?.id;
		let finalImage: ImageUpdate | null = initialImageId
			? { ...initialImage, id: initialImageId }
			: null;

		// 0. Create image if needed
		if (mode === 'create') {
			finalImage = await chosenDBInstance
				.insert(images)
				.values({ ...initialImage, user_id: user.id })
				.returning()
				.get();
		}
		if (!finalImage) throw error(403);
		const { path, id } = finalImage;

		// 1. Get respective translation if updating
		let translation: { key: TranslationSelect['key'] } | null = null;
		if (mode === 'update') {
			if (!id) throw error(403);
			const imageQuery = await db
				.select({ key: translations.key })
				.from(images)
				.leftJoin(translations, eq(translations.key, images.path_translation_key))
				.where(and(eq(images.id, id), eq(images.user_id, user.id)))
				.get();
			if (!imageQuery) throw error(403);
			if (imageQuery.key) {
				translation = { key: imageQuery.key };
			}
		}

		// 2. Create translation if image didn't have one or we're creating an image
		if (translation) {
			if (lang) {
				await this.translations.update({ [lang]: path, key: translation.key }, trx, user);
			} else {
				await this.translations.delete({ key: translation.key }, trx, user);
			}
		} else {
			if (lang) {
				[translation] = await this.translations.create([{ [lang]: path }], undefined, trx, user);
			}
		}

		// 3. Update image record with respecive changes
		type ImageUpdateWithTranslation = ImageUpdate & {
			path_translation_key?: TranslationSelect['key'];
		};
		const updateObject: ImageUpdateWithTranslation = finalImage;
		if (translation) {
			updateObject.path_translation_key = translation.key;
		}
		if (lang) {
			updateObject.path = null;
		} else {
			updateObject.path = path;
		}
		return updateObject;
	};

	public readonly images = {
		create: async (newImage: ImageInsert, trx?: TransactionContext) => {
			const chosenDBInstance = trx || db;
			const user = await this.user.getOrThrow();

			const processedImage = await this.imagesCommon({
				mode: 'create',
				initialImage: newImage,
				lang: null,
				user,
				trx
			});

			return chosenDBInstance
				.update(images)
				.set(processedImage)
				.where(and(eq(images.user_id, user.id), eq(images.id, processedImage.id)))
				.returning()
				.get();
		},
		update: async (newImage: ImageUpdate, lang: SupportedLang | null, trx?: TransactionContext) => {
			const chosenDBInstance = trx || db;
			const user = await this.user.getOrThrow();

			const processedImage = await this.imagesCommon({
				mode: 'update',
				initialImage: newImage,
				lang,
				user,
				trx
			});

			return chosenDBInstance
				.update(images)
				.set(processedImage)
				.where(and(eq(images.user_id, user.id), eq(images.id, processedImage.id)))
				.returning()
				.get();
		},

		delete: async (imageId: ImageSelect['id'], trx?: TransactionContext) => {
			const chosenDBInstance = trx || db;
			const user = await this.user.getOrThrow();

			const translation = await chosenDBInstance
				.select({ translations })
				.from(images)
				.innerJoin(translations, eq(translations.key, images.path_translation_key))
				.where(and(eq(images.user_id, user.id), eq(images.id, imageId)))
				.get();

			if (translation) {
				await this.translations.delete({ key: translation.translations.key }, trx, user);
			}

			// TODO Delete image from provider?

			return chosenDBInstance
				.delete(images)
				.where(and(eq(images.user_id, user.id), eq(images.id, imageId)))
				.run();
		}
	};

	public readonly translations = {
		create: async (
			newTranslations: TranslationInsertBase[],
			mode: 'allow-empty' | 'disallow-empty' = 'allow-empty',
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

			const finalUser = user || (await this.user.getOrThrow());
			newTranslations = newTranslations.map((translation) => ({
				...translation,
				user_id: finalUser.id
			}));

			const chosenDBInstance = trx || db;
			return chosenDBInstance
				.insert(translations)
				.values(newTranslations)
				.returning({ key: translations.key })
				.all();
		},
		update: async (translation: TranslationUpdate, trx?: TransactionContext, user?: User) => {
			const finalUser = user || (await this.user.getOrThrow());
			const chosenDBInstance = trx || db;

			return chosenDBInstance
				.update(translations)
				.set(translation)
				.where(and(eq(translations.key, translation.key), eq(translations.user_id, finalUser.id)))
				.run();
		},
		delete: async (translation: TranslationDelete, trx?: TransactionContext, user?: User) => {
			const finalUser = user || (await this.user.getOrThrow());
			const chosenDBInstance = trx || db;
			return chosenDBInstance
				.delete(translations)
				.where(and(eq(translations.key, translation.key), eq(translations.user_id, finalUser.id)))
				.run();
		}
	};
}
export default Plavna;

export type PlavnaService = typeof Plavna;
