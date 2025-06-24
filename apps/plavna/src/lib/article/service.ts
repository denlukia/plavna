import type { ResultSet } from '@libsql/client';
import { serializePreviewParams, supportedLangs } from '@plavna/common';
import type { ImagePathAndMeta, SupportedLang } from '@plavna/common';
import { ServerImageHandlerVercelEdge } from '@plavna/image-uploader/images';
import { error } from '@sveltejs/kit';
import { and, desc, eq, isNotNull, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import type { User } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { IMAGE_CREDENTIALS_PATH } from '$lib/common/config';
import { db } from '$lib/db/db';
import { ARTICLE_OPENED_PREVIEW_COLS, ARTICLE_OPENED_PREVIEW_ROWS } from '$lib/styles/grid';

import { getNullAndDupFilter, isNonNullable } from '../common/utils';
import { detectConstraintError } from '../errors/detectors';
import { ErrorWithTranslation } from '../errors/ErrorWithTranslation';
import { table_translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type {
	RecordsTranslationsDict,
	SystemTranslationKey,
	TranslationFormsDict
} from '../i18n/types';
import {
	translationInsertSchema,
	translationUpdateAllowEmptySchema,
	translationUpdateSchema
} from '../i18n/validators';
import { table_images } from '../image/schema';
import type { ImageService } from '../image/service';
import type { ImagesDict } from '../image/types';
import { computeSrc, decomposeImageField } from '../image/utils';
import { imageCreationFormSchema, imageUpdateFormSchema } from '../image/validators';
import { previewFamilies } from '../preview/families';
import type { PreviewFamiliesDict } from '../preview/families/types';
import { table_previewTemplates } from '../preview/schema';
import {
	articlePreviewUpdateSchema,
	previewTemplateCreationFormSchema,
	previewTemplateDeletionFormSchema,
	previewTemplateEditingFormSchema
} from '../preview/validators';
import { table_screenshotsQueue } from '../screenshot/schema';
import { calculateDimensionsFromCellsTaken } from '../screenshot/utils';
import type { ScreenshotsQueueInsertLocal } from '../screenshot/validators';
import { table_tags, table_tags_to_articles } from '../tag/schema';
import { tagDeleteSchema, tagUpdateSchema } from '../tag/validators';
import { table_users } from '../user/schema';
import type { ActorService } from '../user/service';
import { table_articles } from './schema';
import {
	articleSelectSchema,
	articleSlugUpdateSchema,
	type ArticleInsert,
	type ArticlePreviewImageFileFieldNamesAll,
	type ArticlePreviewImageHandlers,
	type ArticlePreviewUpdate,
	type ArticleSelect,
	type ArticleSlugUpdate
} from './validators';

export class ArticleService {
	private readonly actorService: ActorService;
	private readonly translationService: TranslationService;
	private readonly imageService: ImageService;

	constructor(
		actorService: ActorService,
		translationService: TranslationService,
		imageService: ImageService
	) {
		this.actorService = actorService;
		this.translationService = translationService;
		this.imageService = imageService;
	}
	private selectErrorWithTranslation(error: object) {
		let message: SystemTranslationKey = 'actor_errors.unknown_error';
		if (error instanceof Error && detectConstraintError(error)) {
			message = 'actor_errors.slug_in_use';
		}
		if ('type' in error && error.type === 'at_least_one_title') {
			message = 'actor_errors.at_least_one_title';
		}
		return new ErrorWithTranslation(message);
	}

	async getMyAsForms(username: User['username']) {
		const actor = await this.actorService.checkOrThrow(null, username);

		const query = await db
			.select({
				id: table_articles.id,
				slug: table_articles.slug,
				publish_time: table_articles.publish_time,
				title_translation: {
					key: table_translations.key,
					value: table_translations[this.translationService.currentLang]
				}
			})
			.from(table_articles)
			.leftJoin(
				table_translations,
				eq(table_articles.title_translation_key, table_translations.key)
			)
			.where(eq(table_articles.user_id, actor.id))
			.orderBy(desc(table_articles.id));

		const forms = query.map(({ title_translation, ...article }) => ({
			title_translation_key: title_translation?.key,
			...article
		}));
		const recordsTranslations = query.reduce((acc, { title_translation }) => {
			if (title_translation && title_translation.value) {
				acc[title_translation.key] = title_translation.value;
			}
			return acc;
		}, {} as RecordsTranslationsDict);

		return {
			articles: forms,
			recordsTranslations
		};
	}
	async getIdIfExists(username: User['username'], slug: ArticleSelect['slug']) {
		const article = await db
			.select({ id: table_articles.id })
			.from(table_articles)
			.innerJoin(table_users, eq(table_users.username, username))
			.where(and(eq(table_articles.slug, slug), eq(table_articles.user_id, table_users.id)))
			.get();
		if (article) {
			return article.id;
		} else {
			return null;
		}
	}
	async createFromSlug(slug: ArticleInsert['slug']) {
		const actor = await this.actorService.getOrThrow();
		return db.transaction(async (trx) => {
			const newTranslation = {
				user_id: actor.id
			};
			const [
				{ key: title_translation_key },
				{ key: description_translation_key },
				{ key: content_translation_key },
				{ key: preview_translation_1_key },
				{ key: preview_translation_2_key }
			] = await this.translationService.create(
				new Array(5).fill(newTranslation),
				'allow-empty',
				trx
			);

			let source = null;
			try {
				const imageHandler = new ServerImageHandlerVercelEdge();
				await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);
				source = imageHandler.provider?.type;
			} catch {
				// TODO: Error
			}
			const [{ id: preview_image_1_id }, { id: preview_image_2_id }] = await Promise.all([
				this.imageService.createRecord({ source }, trx),
				this.imageService.createRecord({ source }, trx)
			]);

			const article = await trx
				.insert(table_articles)
				.values({
					user_id: actor.id,
					slug: slug,
					title_translation_key: Number(title_translation_key),
					description_translation_key: Number(description_translation_key),
					content_translation_key: Number(content_translation_key),
					preview_family: 'modern',
					preview_translation_1_key,
					preview_translation_2_key,
					preview_image_1_id,
					preview_image_2_id
				})
				.returning({ id: table_articles.id })
				.get();

			return article.id;
		});
	}
	async loadEditor(username: User['username'], slug: ArticleSelect['slug']) {
		const actor = await this.actorService.checkOrThrow(null, username);

		const exisingId = await this.getIdIfExists(username, slug);
		if (exisingId === null) {
			error(404);
		}

		const translForForms = alias(table_translations, 'translForForms');
		const translForImageInputs = alias(table_translations, 'translForImageInputs');
		const commonImagesTable = alias(table_images, 'commonImages');
		const articleImagesTable = alias(table_images, 'articleImages');
		const results = await db
			.select({
				articles: table_articles,
				tagsArticles: table_tags_to_articles,
				tags: table_tags,
				translations: table_translations,
				translForForms,
				translForImageInputs,
				previewTemplates: table_previewTemplates,
				images: table_images,
				commonImagesTable,
				articleImagesTable
			})
			.from(table_articles)
			.leftJoin(table_previewTemplates, eq(table_previewTemplates.user_id, actor.id))
			.leftJoin(
				table_images,
				or(
					eq(table_images.id, table_previewTemplates.image_id),
					eq(table_images.id, table_articles.preview_image_1_id),
					eq(table_images.id, table_articles.preview_image_2_id)
				)
			)
			.leftJoin(
				commonImagesTable,
				and(eq(commonImagesTable.user_id, actor.id), eq(commonImagesTable.is_account_common, true))
			)
			.leftJoin(
				articleImagesTable,
				and(
					eq(articleImagesTable.user_id, actor.id),
					eq(articleImagesTable.owning_article_id, exisingId)
				)
			)
			.leftJoin(table_tags, eq(table_tags.user_id, actor.id))
			.leftJoin(
				table_translations,
				or(eq(table_translations.key, table_previewTemplates.name_translation_key))
			)
			.leftJoin(
				translForImageInputs,
				or(
					eq(translForImageInputs.key, table_images.path_translation_key),
					eq(translForImageInputs.key, commonImagesTable.path_translation_key),
					eq(translForImageInputs.key, articleImagesTable.path_translation_key)
				)
			)
			.leftJoin(
				translForForms,
				or(
					eq(translForForms.key, table_articles.title_translation_key),
					eq(translForForms.key, table_articles.description_translation_key),
					eq(translForForms.key, table_articles.content_translation_key),
					eq(translForForms.key, table_tags.name_translation_key),
					eq(translForForms.key, table_articles.preview_translation_1_key),
					eq(translForForms.key, table_articles.preview_translation_2_key),
					eq(translForForms.key, table_previewTemplates.name_translation_key)
				)
			)
			.leftJoin(table_tags_to_articles, eq(table_tags_to_articles.article_id, exisingId))
			.where(eq(table_articles.id, exisingId))
			.all();

		const articleResult = results[0].articles;
		const translationsArr = results
			.map((rows) => rows.translations)
			.filter(getNullAndDupFilter('key'));
		const imagesArr = results.map((rows) => rows.images).filter(getNullAndDupFilter('id'));
		const translationsForForms = results
			.map((rows) => rows.translForForms)
			.filter(getNullAndDupFilter('key'));
		const translationsForImageInputs = results
			.map((rows) => rows.translForImageInputs)
			.filter(getNullAndDupFilter('key'));
		const previewTemplatesResults = await Promise.all(
			results
				.map((rows) => rows.previewTemplates)
				.filter(getNullAndDupFilter('id'))
				.map(async (template) => {
					const foundTranslation = translationsForForms.find(
						(translation) => translation.key === template.name_translation_key
					);

					return {
						meta: template,
						superValidatedMain: await superValidate(
							{ ...template, template_id: template.id, ...foundTranslation },
							zod(previewTemplateEditingFormSchema)
						),
						superValidatedDeletion: await superValidate(
							template,
							zod(previewTemplateDeletionFormSchema)
						)
					};
				})
		);
		const allTags = results.map((rows) => rows.tags).filter(getNullAndDupFilter('id'));
		const articleTags = results
			.map((rows) => rows.tagsArticles)
			.filter(getNullAndDupFilter('tag_id'));

		const tagInfos = await Promise.all(
			allTags.map(async (tag) => ({
				checkedSuperValidated: await superValidate(
					{ ...tag, checked: !!articleTags.find((t) => t.tag_id === tag.id) },
					zod(tagUpdateSchema),
					{ id: 'tag-checked-' + tag.id }
				),
				deletionSuperValidated: await superValidate(tag, zod(tagDeleteSchema), {
					id: 'tag-delete-' + tag.id
				}),
				name_translation_key: tag.name_translation_key
			}))
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
			previewEditorSuperValidated: await superValidate(
				articleResult,
				zod(articlePreviewUpdateSchema)
			),
			previewFamilies: previewFamilies.reduce(
				(acc, curr) => ({
					...acc,
					[curr.id]: {
						components: { viewer: null, editor: null },
						name_translation_key: curr.name_translation_key
					}
				}),
				{} as PreviewFamiliesDict
			),
			previewTemplates: previewTemplatesResults,
			previewTemplateCreationSuperValidated: await superValidate(
				zod(previewTemplateCreationFormSchema)
			),
			tagInfos,
			tagCreationSuperValidated: await superValidate(zod(translationInsertSchema)),
			images: imagesArr.reduce(
				(acc, { id, ...curr }) => ({
					...acc,
					[id]: curr
				}),
				{} as ImagesDict
			),
			imageInputsTranslations: Object.fromEntries(
				translationsForImageInputs.map(({ key, ...translation }) => {
					return [key, translation];
				})
			),
			commonImages,
			articleImages,
			translations: Object.fromEntries(
				translationsArr.map((translation) => {
					return [translation.key, translation[this.translationService.currentLang]];
				})
			),
			translationForms: Object.fromEntries(
				await Promise.all(
					translationsForForms.map(async (translation) => {
						const { key } = translation;
						const emptyAllowedKeys = [
							articleResult.description_translation_key,
							articleResult.content_translation_key
						];
						const schema = emptyAllowedKeys.includes(key)
							? translationUpdateAllowEmptySchema
							: translationUpdateSchema;

						return [
							key,
							await superValidate(translation, zod(schema), {
								id: 'translation-' + key
							})
						];
					})
				)
			) as TranslationFormsDict
		};
	}
	async updateSlug(slug: string, article: ArticleSlugUpdate) {
		const actor = await this.actorService.getOrThrow();
		try {
			const response = await db
				.update(table_articles)
				.set(article)
				.where(and(eq(table_articles.slug, slug), eq(table_articles.user_id, actor.id)))
				.returning({ slug: table_articles.slug })
				.get();
			return response;
		} catch (e) {
			throw this.selectErrorWithTranslation(e);
		}
	}
	async publish(slug: string) {
		const actor = await this.actorService.getOrThrow();
		return db
			.update(table_articles)
			.set({ publish_time: new Date() })
			.where(and(eq(table_articles.slug, slug), eq(table_articles.user_id, actor.id)))
			.returning({ slug: table_articles.slug })
			.get();
	}
	async hide(slug: string) {
		const actor = await this.actorService.getOrThrow();
		return db
			.update(table_articles)
			.set({ publish_time: null })
			.where(and(eq(table_articles.slug, slug), eq(table_articles.user_id, actor.id)))
			.returning({ slug: table_articles.slug })
			.get();
	}
	async delete(slug: string) {
		const actor = await this.actorService.getOrThrow();
		const articleDeleted = await db
			.delete(table_articles)
			.where(and(eq(table_articles.slug, slug), eq(table_articles.user_id, actor.id)))
			.returning({ id: table_articles.id })
			.get();
		if (!articleDeleted) throw new Error('Article not found');
		await this.imageService.deleteRecord(articleDeleted.id);
	}
	async updatePreview(
		slug: string,
		preview: ArticlePreviewUpdate,
		imageHandlers: ArticlePreviewImageHandlers,
		keysForDeletion: string[]
	) {
		// Common for 1. and 3.
		const actor = await this.actorService.getOrThrow();
		let source,
			providerData = null;

		// TODO: Remake all such places to not call Image Handler if not uploading images
		try {
			const imageHandler = new ServerImageHandlerVercelEdge();
			await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);
			const provider = imageHandler.provider;
			if (provider) {
				source = provider.type;
				providerData = provider.data;
			}
		} catch {
			console.error('Error setting image uploader from user');
		}
		// 1. Article fields update
		if (preview.preview_family && preview.preview_family !== 'custom') {
			preview.preview_template_id = null;
		}
		if (preview.preview_template_id) {
			preview.preview_family = 'custom';
		}
		if (preview.preview_family === 'custom' && !preview.preview_template_id) {
			error(500);
		}

		const whereCondition = and(eq(table_articles.slug, slug), eq(table_articles.user_id, actor.id));
		const articleUpdatePromise = db.update(table_articles).set(preview).where(whereCondition).run();
		const promisesToWaitFor: Promise<ResultSet | void>[] = [articleUpdatePromise];

		// 2. Upload images if present and update records
		// TODO: There were validImage field in ImageHandler, we replaced
		// for just imageHandler presence, check if everything works ok still
		const validImagesPresent = Object.entries(imageHandlers).some(([key, imageHandler]) => {
			return imageHandler && !keysForDeletion.find((k) => k === `delete_${key}`);
		});
		if (validImagesPresent) {
			const queryResult = await db
				.select({
					preview_image_1_id: table_articles.preview_image_1_id,
					preview_image_2_id: table_articles.preview_image_2_id
				})
				.from(table_articles)
				.where(whereCondition)
				.all();
			const articleRecord = queryResult[0];

			if (!queryResult) error(500);
			const uploadPromises = Object.entries(imageHandlers).map(
				async ([fieldName, imageHandler]) => {
					const fieldNameTyped = fieldName as ArticlePreviewImageFileFieldNamesAll;
					const { fieldNameWithIdPrefix, lang } = decomposeImageField(fieldNameTyped);
					if (imageHandler && !keysForDeletion.find((k) => k === `delete_${fieldName}`)) {
						await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);
						const record = await imageHandler.upload({
							imageId: articleRecord[fieldNameWithIdPrefix],
							lang
						});
						await this.imageService.updatePath(record.record, lang);
					}
				}
			);
			const deletionPromises = keysForDeletion.map((key) => {
				const keyDeprefixed = key.replace('delete_', '') as ArticlePreviewImageFileFieldNamesAll;
				const { fieldNameWithIdPrefix, lang } = decomposeImageField(keyDeprefixed);

				return this.imageService.updatePath({ id: articleRecord[fieldNameWithIdPrefix] }, lang);
			});
			await Promise.all([...deletionPromises, ...uploadPromises]);
		}

		// 3. Enqueue preview screenshots if needed
		if (preview.preview_family === 'custom' && preview.preview_template_id) {
			const articleResult = await db
				.select({
					articles: table_articles,
					images: table_images,
					translations: table_translations,
					previewTemplateUrl: table_previewTemplates.url
				})
				.from(table_articles)
				.innerJoin(
					table_previewTemplates,
					eq(table_previewTemplates.id, preview.preview_template_id)
				)
				.leftJoin(
					table_images,
					or(
						eq(table_images.id, table_articles.preview_image_1_id),
						eq(table_images.id, table_articles.preview_image_2_id)
					)
				)
				.leftJoin(
					table_translations,
					or(
						eq(table_translations.key, table_articles.preview_translation_1_key),
						eq(table_translations.key, table_articles.preview_translation_2_key),
						eq(table_translations.key, table_images.path_translation_key),
						eq(table_translations.key, table_articles.title_translation_key),
						eq(table_translations.key, table_articles.description_translation_key)
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
					title_translation_key,
					description_translation_key
				} = articleResult[0].articles;
				let { preview_screenshot_image_id, preview_screenshot_in_article_image_id } =
					articleResult[0].articles;

				const imagesArr = articleResult
					.map(({ images }) => images)
					.filter(getNullAndDupFilter('id'));
				const translationsArr = articleResult
					.map(({ translations }) => translations)
					.filter(getNullAndDupFilter('key'));

				const preview_translation_1 =
					translationsArr.find((t) => t.key === preview_translation_1_key)?.[
						this.translationService.currentLang
					] || '';
				const preview_translation_2 =
					translationsArr.find((t) => t.key === preview_translation_2_key)?.[
						this.translationService.currentLang
					] || '';
				const titleTranslationObj = translationsArr.find((t) => t.key === title_translation_key);
				const descriptionTranslationObj = translationsArr.find(
					(t) => t.key === description_translation_key
				);

				// Creating screenshot image record if needed
				if (!preview_screenshot_image_id) {
					const newImageRecord = await this.imageService.createRecord({ source });
					preview_screenshot_image_id = newImageRecord.id;
					await db
						.update(table_articles)
						.set({ preview_screenshot_image_id: newImageRecord.id })
						.where(whereCondition);
				}
				if (!preview_screenshot_in_article_image_id) {
					const newImageRecord = await this.imageService.createRecord({ source });
					preview_screenshot_in_article_image_id = newImageRecord.id;
					await db
						.update(table_articles)
						.set({ preview_screenshot_in_article_image_id: newImageRecord.id })
						.where(whereCondition);
				}

				if (preview_screenshot_image_id && preview_screenshot_in_article_image_id && providerData) {
					let queueRecordsForInsert: Array<ScreenshotsQueueInsertLocal> = [];

					queueRecordsForInsert = supportedLangs
						.map((lang) => {
							if (lang && titleTranslationObj?.[lang]) {
								const urlConfigBase = {
									title_translation: titleTranslationObj?.[lang],
									description_translation: descriptionTranslationObj?.[lang],
									rows: preview_rows,
									cols: preview_columns,
									likes_count: articleResult[0].articles.likes_count,
									lang: this.translationService.currentLang,
									publish_time: articleResult[0].articles.publish_time,
									prop_1: preview.preview_prop_1 || null,
									prop_2: preview.preview_prop_2 || null,
									prop_3: preview.preview_prop_3 || null,
									prop_4: preview.preview_prop_4 || null,
									translation_1: preview_translation_1,
									translation_2: preview_translation_2,
									img_1: getImage(preview_image_1_id, lang),
									img_2: getImage(preview_image_2_id, lang),
									url: null,
									tags: []
									// TODO: Tags
								};

								function getImage(
									imageId: number | null,
									lang: SupportedLang
								): ImagePathAndMeta | null {
									const image = imagesArr.find((i) => i.id === imageId);
									if (!image) return null;

									const { id, width, height, background } = image;
									let { path } = image;

									if (image && image.path_translation_key) {
										const translatedPath = translationsArr.find(
											(t) => t.key === image.path_translation_key
										)?.[lang];
										if (translatedPath) {
											path = computeSrc(image.source, null, translatedPath);
										}
									}

									if (!path) return null;

									return { id, src: path, width, height, background, alt: '' };
								}

								const { width: width, height: height } = calculateDimensionsFromCellsTaken({
									preview_columns: preview_columns,
									preview_rows: preview_rows
								});
								const url = serializePreviewParams(previewTemplateUrl, {
									...urlConfigBase,
									width: width,
									height: height,
									viewing_in_article: false
								});

								const { width: widthInArticle, height: heightInArticle } =
									calculateDimensionsFromCellsTaken({
										preview_columns: ARTICLE_OPENED_PREVIEW_COLS,
										preview_rows: ARTICLE_OPENED_PREVIEW_ROWS
									});
								const urlInArticle = serializePreviewParams(previewTemplateUrl, {
									...urlConfigBase,
									width: widthInArticle,
									height: heightInArticle,
									viewing_in_article: true
								});

								const screenshotQueueRecordBase = {
									lang,
									imageProviderData: providerData
								};

								return [
									{
										...screenshotQueueRecordBase,
										image_id: preview_screenshot_image_id,
										width: width,
										height: height,
										url: url
									},
									{
										...screenshotQueueRecordBase,
										image_id: preview_screenshot_in_article_image_id,
										width: widthInArticle,
										height: heightInArticle,
										url: urlInArticle
									}
								];
							} else {
								return null;
							}
						})
						.filter(isNonNullable)
						.flat();

					if (queueRecordsForInsert.length === 0) {
						throw this.selectErrorWithTranslation({ type: 'at_least_one_title' });
					}

					const queueRecordsInserPromise = db
						.insert(table_screenshotsQueue)
						.values(queueRecordsForInsert)
						.run();
					promisesToWaitFor.push(queueRecordsInserPromise);
				}
			}
		} else {
			// TODO: Delete any queues and images
		}
		return Promise.all(promisesToWaitFor);
	}
	async getOne(username: string, slug: string) {
		const actor = await this.actorService.get();
		const titleTranslationAlias = alias(table_translations, 'title_translation');
		const query = await db
			.select({
				articles: table_articles,
				titleTranslationAlias,
				translations: {
					key: table_translations.key,
					[this.translationService.currentLang]:
						table_translations[this.translationService.currentLang]
				},
				previewTypes: table_previewTemplates,
				tags: table_tags,
				images: table_images
			})
			.from(table_articles)
			.innerJoin(table_users, eq(table_users.id, table_articles.user_id))
			.leftJoin(
				table_previewTemplates,
				eq(table_previewTemplates.id, table_articles.preview_template_id)
			)
			.leftJoin(table_tags_to_articles, eq(table_tags_to_articles.article_id, table_articles.id))
			.leftJoin(table_tags, eq(table_tags.id, table_tags_to_articles.tag_id))
			.leftJoin(
				titleTranslationAlias,
				eq(titleTranslationAlias.key, table_articles.title_translation_key)
			)
			.leftJoin(
				table_images,
				and(
					eq(table_images.user_id, table_articles.user_id),
					or(
						eq(table_images.owning_article_id, table_articles.id),
						eq(table_images.is_account_common, true),
						eq(table_images.id, table_articles.preview_image_1_id),
						eq(table_images.id, table_articles.preview_image_2_id),
						eq(table_images.id, table_articles.preview_screenshot_image_id),
						eq(table_images.id, table_articles.preview_screenshot_in_article_image_id)
					)
				)
			)
			.leftJoin(
				table_translations,
				or(
					eq(table_translations.key, table_articles.content_translation_key),
					eq(table_translations.key, table_tags.name_translation_key),
					eq(table_translations.key, table_images.path_translation_key)
				)
			)

			.where(
				and(
					eq(table_users.username, username),
					eq(table_articles.slug, slug),
					isNotNull(titleTranslationAlias[this.translationService.currentLang])
				)
			)
			.all();

		if (!query.length) {
			error(404);
		}
		if ((!actor || actor.username !== username) && query[0].articles.publish_time === null) {
			error(404);
		}
		return {
			article: query[0].articles,
			previewTemplateUrl: query[0].previewTypes?.url || null,
			translations: Object.fromEntries([
				...query
					.map((row) => row.translations)
					.filter(getNullAndDupFilter('key'))
					.map((row) => [row.key, row[this.translationService.currentLang]]),
				...query
					.map((row) => row.titleTranslationAlias)
					.filter(getNullAndDupFilter('key'))
					.map((row) => [row.key, row[this.translationService.currentLang]])
			]) as RecordsTranslationsDict,
			images: query.map((rows) => rows.images).filter(getNullAndDupFilter('id')),
			tags: query.map((rows) => rows.tags).filter(getNullAndDupFilter('id'))
		};
	}
}
