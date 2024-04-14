import { supportedLangs } from '@denlukia/plavna-common/constants';
import { ServerImageHandler } from '@denlukia/plavna-common/server';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { ResultSet } from '@libsql/client';
import { error, fail } from '@sveltejs/kit';
import type { page } from '$app/stores';
import {
	and,
	desc,
	eq,
	getTableColumns,
	inArray,
	isNotNull,
	or,
	sql,
	type ExtractTablesWithRelations
} from 'drizzle-orm';
import { alias, type SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { Session as LuciaSession, User as LuciaUser } from 'lucia';
import { marked } from 'marked';
import type { SuperValidated } from 'sveltekit-superforms';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ERRORS } from '$lib/collections/errors';
import { articleSelectSchema, articleSlugUpdateSchema } from '$lib/features/article/parsers';
import type {
	ArticleInsert,
	ArticlePreviewImageFileFieldNamesAll,
	ArticlePreviewImageHandlers,
	ArticlePreviewUpdate,
	ArticleSelect,
	ArticleSlugUpdate
} from '$lib/features/article/parsers';
import { articles } from '$lib/features/article/schemas';
import type { ImageProviderUpdate, User } from '$lib/features/auth/parsers';
import { users } from '$lib/features/auth/schemas';
import { getNullAndDupFilter, hasNonEmptyProperties, nonNull } from '$lib/features/common/utils';
import { translationInsertSchema, translationUpdateSchema } from '$lib/features/i18n/parsers';
import type {
	TranslationDelete,
	TranslationInsert,
	TranslationInsertBase,
	TranslationSelect,
	TranslationUpdate
} from '$lib/features/i18n/parsers';
import { translations } from '$lib/features/i18n/schemas';
import { defaultLang, isSupportedLang } from '$lib/features/i18n/utils';
import {
	imageCreationFormSchema,
	imageProviderUpdateFormSchema,
	imageUpdateFormSchema
} from '$lib/features/image/parsers';
import type { ImageInsert, ImageSelect, ImageUpdate } from '$lib/features/image/parsers';
import { images } from '$lib/features/image/schemas';
import { decomposeImageField } from '$lib/features/image/utils';
import {
	pageCreationFormSchema,
	pageDeletionFormSchema,
	pageUpdatingFormSchema
} from '$lib/features/page/parsers';
import type { PageCreateForm, PageSelect, PageUpdateForm } from '$lib/features/page/parsers';
import { pages } from '$lib/features/page/schemas';
import { previewFamilies } from '$lib/features/preview/families';
import {
	articlePreviewUpdateSchema,
	previewTemplateCreationFormSchema,
	previewTemplateEditingFormSchema
} from '$lib/features/preview/parsers';
import type {
	PreviewTemplateCreation,
	PreviewTemplateDeletion,
	PreviewTemplateEditing
} from '$lib/features/preview/parsers';
import { previewTemplates } from '$lib/features/preview/schemas';
import type { ScreenshotsQueueInsertLocal } from '$lib/features/screenshot/parsers';
import { screenshotsQueue } from '$lib/features/screenshot/schemas';
import {
	calculateDimensionsFromCellsTaken,
	composeURLForScreenshot,
	getMaybeTranslatedImagePath
} from '$lib/features/screenshot/utils';
import type { SectionDelete, SectionUpdate } from '$lib/features/section/parsers';
import { sections, sectionsToTags } from '$lib/features/section/schemas';
import { findTagIdsInLinks } from '$lib/features/section/utils';
import { tagUpdateSchema } from '$lib/features/tag/parsers';
import type { TagDelete, TagUpdate } from '$lib/features/tag/parsers';
import { tags, tagsToArticles } from '$lib/features/tag/schemas';

import { POSTS_PER_SECTION, SECTIONS_PER_LOAD } from '../collections/constants';
import { db } from './db';

type TransactionContext = SQLiteTransaction<
	'async',
	ResultSet,
	typeof import('$lib/collections/schemas'),
	ExtractTablesWithRelations<typeof import('$lib/collections/schemas')>
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
	private readonly userObj: LuciaUser | null;
	private readonly lang: SupportedLang;

	constructor(user: LuciaUser | null, langParam: string | undefined) {
		this.userObj = user;

		if (!langParam) {
			this.lang = defaultLang;
		} else if (isSupportedLang(langParam)) {
			this.lang = langParam;
		} else {
			error(404);
		}
	}

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
			const previewTemplatesResults = await Promise.all(
				results
					.map((rows) => rows.previewTemplates)
					.filter(getNullAndDupFilter('id'))
					.map(async (template) => {
						const foundTranslation = translationsForPreviewTemplates.find(
							(translation) => translation.key === template.name_translation_key
						);

						return {
							meta: template,
							form: await superValidate(
								{ ...template, template_id: template.id, ...foundTranslation },
								zod(previewTemplateEditingFormSchema)
							)
						};
					})
			);
			const allTags = results.map((rows) => rows.tags).filter(getNullAndDupFilter('id'));
			const articleTags = results
				.map((rows) => rows.tagsArticles)
				.filter(getNullAndDupFilter('tag_id'));
			const translationsForForms = results
				.map((rows) => rows.translForForms)
				.filter(getNullAndDupFilter('key'));
			const tagInfos = await Promise.all(
				allTags.map(async (tag) => ({
					checkedForm: await superValidate(
						{ ...tag, checked: !!articleTags.find((t) => t.tag_id === tag.id) },
						zod(tagUpdateSchema),
						{ id: 'is-checked-' + tag.id }
					),
					name_translation_key: tag.name_translation_key
				}))
			);
			const previewForms = await Promise.all(
				[...previewFamilies, ...previewTemplatesResults].map(async (familyOrTemplate) => {
					const emptyForm = await superValidate(zod(articlePreviewUpdateSchema));
					const filledForm = await superValidate(articleResult, zod(articlePreviewUpdateSchema));
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
				})
			);
			const commonImages = {
				creation: await superValidate(zod(imageCreationFormSchema), {
					id: 'common-image-creation'
				}),
				items: await Promise.all(
					results
						.map((rows) => rows.commonImagesTable)
						.filter(getNullAndDupFilter('id'))
						.map(async (image) => ({
							meta: image,
							form: await superValidate(image, zod(imageUpdateFormSchema), {
								id: 'image-' + image.id
							})
						}))
				)
			};
			const articleImages = {
				creation: await superValidate(zod(imageCreationFormSchema), {
					id: 'article-image-creation'
				}),
				items: await Promise.all(
					results
						.map((rows) => rows.articleImagesTable)
						.filter(getNullAndDupFilter('id'))
						.map(async (image) => ({
							meta: image,
							form: await superValidate(image, zod(imageUpdateFormSchema), {
								id: 'image-' + image.id
							})
						}))
				)
			};

			return {
				meta: articleSelectSchema.parse(articleResult),
				slugForm: await superValidate(articleResult, zod(articleSlugUpdateSchema)),
				previewForms,
				previewFamilies,
				previewTemplates: previewTemplatesResults,
				previewTemplateCreationForm: await superValidate(zod(previewTemplateCreationFormSchema)),
				tagInfos,
				tagCreationForm: await superValidate(zod(translationInsertSchema)),
				imageProviderForm: await superValidate(user, zod(imageProviderUpdateFormSchema)),
				images: imagesArr,
				commonImages,
				articleImages,
				translations: Object.fromEntries(
					translationsArr.map((translation) => {
						return [translation.key, translation[this.lang]];
					})
				),
				translationForms: Object.fromEntries(
					await Promise.all(
						translationsForForms.map(async (translation) => {
							const { key } = translation;
							return [
								key,
								await superValidate(translation, zod(translationUpdateSchema), {
									id: 'translation-' + key
								})
							];
						})
					)
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
			const articleDeleted = await db
				.delete(articles)
				.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))
				.returning({ id: articles.id })
				.get();
			if (!articleDeleted) throw new Error('Article not found');
			await this.images.delete(articleDeleted.id);
		},
		updatePreview: async (
			slug: string,
			preview: ArticlePreviewUpdate,
			imageHandlers: ArticlePreviewImageHandlers,
			keysForDeletion: string[]
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
			const validImagesPresent = Object.entries(imageHandlers).some(([key, { hasValidImage }]) => {
				hasValidImage && !keysForDeletion.find((k) => k === `delete_${key}`);
			});
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

				if (!queryResult) error(500);
				const uploadPromises = Object.entries(imageHandlers).map(
					async ([fieldName, imageHandler]) => {
						const fieldNameTyped = fieldName as ArticlePreviewImageFileFieldNamesAll;
						const { fieldNameWithIdPrefix, lang } = decomposeImageField(fieldNameTyped);
						if (
							imageHandler.hasValidImage &&
							!keysForDeletion.find((k) => k === `delete_${fieldName}`)
						) {
							await imageHandler.setUploaderFromUser(user);
							const record = await imageHandler.processAndUpload({
								imageId: articleRecord[fieldNameWithIdPrefix],
								lang
							});
							await this.images.update(record.record, lang);
						}
					}
				);
				const deletionPromises = keysForDeletion.map((key) => {
					const keyDeprefixed = key.replace('delete_', '') as ArticlePreviewImageFileFieldNamesAll;
					const { fieldNameWithIdPrefix, lang } = decomposeImageField(keyDeprefixed);

					return this.images.delete(articleRecord[fieldNameWithIdPrefix], lang);
				});
				await Promise.all([...deletionPromises, ...uploadPromises]);
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
			const userPromise = await this.user.get();
			const titleTranslationAlias = alias(translations, 'title_translation');
			const queryPromise = db
				.select({
					articles: articles,
					titleTranslationAlias,
					translations: { key: translations.key, [this.lang]: translations[this.lang] },
					previewTypes: previewTemplates,
					tags,
					images
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
					images,
					and(
						eq(images.user_id, articles.user_id),
						or(eq(images.owning_article_id, articles.id), eq(images.is_account_common, true))
					)
				)
				.leftJoin(
					translations,
					or(
						eq(translations.key, articles.content_translation_key),
						eq(translations.key, tags.name_translation_key),
						eq(translations.key, images.path_translation_key)
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
				error(404);
			}
			if ((!user || user.username !== username) && query[0].articles.publish_time === null) {
				error(404);
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
				images: query.map((rows) => rows.images).filter(getNullAndDupFilter('id')),
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
					error(403, ERRORS.PREVIEW_TEMPLATE_NOT_FOUND);
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
					error(403, ERRORS.PREVIEW_TEMPLATE_NOT_FOUND);
				}
				if (recordResult) {
					if (recordResult.images.path) {
						// TODO Folder deletion
					}
					await this.images.delete(recordResult.images.id, undefined, trx);
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
		if (!finalImage) error(403);
		const { path, id } = finalImage;

		// 1. Get respective translation if updating
		let translation: { key: TranslationSelect['key'] } | null = null;
		if (mode === 'update') {
			if (!id) error(403);
			const imageQuery = await db
				.select({ key: translations.key })
				.from(images)
				.leftJoin(translations, eq(translations.key, images.path_translation_key))
				.where(and(eq(images.id, id), eq(images.user_id, user.id)))
				.get();
			if (!imageQuery) error(403);
			if (imageQuery.key) {
				translation = { key: imageQuery.key };
			}
		}

		// 2. Create translation if image didn't have one or we're creating an image
		if (translation) {
			if (lang) {
				await this.translations.update({ [lang]: path, key: translation.key }, trx);
			} else {
				await this.translations.delete({ key: translation.key }, trx);
			}
		} else {
			if (lang) {
				[translation] = await this.translations.create([{ [lang]: path }], undefined, trx);
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

			// TODO Delete old image from provider

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
		delete: async (
			imageId: ImageSelect['id'],
			lang?: SupportedLang | null,
			trx?: TransactionContext
		) => {
			const chosenDBInstance = trx || db;
			const user = await this.user.getOrThrow();
			const mode =
				typeof lang === 'string'
					? 'translation-deletion'
					: lang === null
						? 'default-deletion'
						: 'whole-deletion';
			const whereCondition = and(eq(images.user_id, user.id), eq(images.id, imageId));

			const translation = await chosenDBInstance
				.select({ translations })
				.from(images)
				.innerJoin(translations, eq(translations.key, images.path_translation_key))
				.where(whereCondition)
				.get();

			// TODO Delete image from provider

			if (mode === 'translation-deletion') {
				if (translation) {
					if (typeof lang !== 'string') error(403);
					await this.translations.update({ [lang]: null, key: translation.translations.key }, trx);
				}
			} else if (mode === 'default-deletion') {
				await chosenDBInstance.update(images).set({ path: null }).where(whereCondition).run();
			} else {
				if (translation) {
					await this.translations.delete({ key: translation.translations.key }, trx);
				}
				await chosenDBInstance.delete(images).where(whereCondition).run();
			}
		}
	};
}
export default Plavna;

export type PlavnaService = typeof Plavna;
