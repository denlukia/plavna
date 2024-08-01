import { supportedLangs } from '@denlukia/plavna-common/constants';
import { ServerImageHandler } from '@denlukia/plavna-common/server';
import type { ResultSet } from '@libsql/client';
import { error } from '@sveltejs/kit';
import { and, eq, isNotNull, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import type { User } from 'lucia';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import { getNullAndDupFilter, isNonNullable } from '../common/utils';
import { translationInsertSchema, translationUpdateSchema } from '../i18n/parsers';
import { translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { TranslationFormsDict } from '../i18n/types';
import {
	imageCreationFormSchema,
	imageProviderUpdateFormSchema,
	imageUpdateFormSchema
} from '../image/parsers';
import { images } from '../image/schema';
import type { ImageService } from '../image/service';
import type { ImagesDict } from '../image/types';
import { decomposeImageField } from '../image/utils';
import { previewFamilies } from '../preview/families';
import type { PreviewFamiliesDict } from '../preview/families/types';
import {
	articlePreviewUpdateSchema,
	previewTemplateCreationFormSchema,
	previewTemplateDeletionFormSchema,
	previewTemplateEditingFormSchema
} from '../preview/parsers';
import { previewTemplates } from '../preview/schema';
import type { ScreenshotsQueueInsertLocal } from '../screenshot/parsers';
import { screenshotsQueue } from '../screenshot/schema';
import {
	calculateDimensionsFromCellsTaken,
	composeURLForScreenshot,
	getMaybeTranslatedImagePath
} from '../screenshot/utils';
import { tagDeleteSchema, tagUpdateSchema } from '../tag/parsers';
import { tags, tagsToArticles } from '../tag/schema';
import { users } from '../user/schema';
import type { ActorService } from '../user/service';
import {
	articleSelectSchema,
	articleSlugUpdateSchema,
	type ArticleInsert,
	type ArticlePreviewImageFileFieldNamesAll,
	type ArticlePreviewImageHandlers,
	type ArticlePreviewUpdate,
	type ArticleSelect,
	type ArticleSlugUpdate
} from './parsers';
import { articles } from './schema';

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

	async getIdIfExists(slug: ArticleSelect['slug']) {
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
				source = (await new ServerImageHandler().setProviderAndUploader(actor)).provider?.type;
			} catch {
				console.log('Error setting image uploader from user');
			}
			const [{ id: preview_image_1_id }, { id: preview_image_2_id }] = await Promise.all([
				this.imageService.create({ source }, trx),
				this.imageService.create({ source }, trx)
			]);

			const article = await trx
				.insert(articles)
				.values({
					user_id: actor.id,
					slug: slug,
					title_translation_key: Number(title_translation_key),
					description_translation_key: Number(description_translation_key),
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
	}
	async loadEditor(username: User['username'], slug: ArticleSelect['slug']) {
		const actor = await this.actorService.checkOrThrow(null, username);

		let exisingId = await this.getIdIfExists(slug);
		if (exisingId === null) {
			// TODO Remove creating new by just visiting url
			exisingId = await this.createFromSlug(slug);
		}

		const translForForms = alias(translations, 'translForForms');
		const commonImagesTable = alias(images, 'commonImages');
		const articleImagesTable = alias(images, 'articleImages');
		const results = await db
			.select({
				articles: articles,
				tagsArticles: tagsToArticles,
				tags,
				translations,
				translForForms,
				previewTemplates,
				images,
				commonImagesTable,
				articleImagesTable
			})
			.from(articles)
			.leftJoin(previewTemplates, eq(previewTemplates.user_id, actor.id))
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
				and(eq(commonImagesTable.user_id, actor.id), eq(commonImagesTable.is_account_common, true))
			)
			.leftJoin(
				articleImagesTable,
				and(
					eq(articleImagesTable.user_id, actor.id),
					eq(articleImagesTable.owning_article_id, exisingId)
				)
			)
			.leftJoin(tags, eq(tags.user_id, actor.id))
			.leftJoin(
				translations,
				or(
					eq(translations.key, images.path_translation_key),
					eq(translations.key, previewTemplates.name_translation_key)
				)
			)
			.leftJoin(
				translForForms,
				or(
					eq(translForForms.key, articles.title_translation_key),
					eq(translForForms.key, articles.description_translation_key),
					eq(translForForms.key, articles.content_translation_key),
					eq(translForForms.key, tags.name_translation_key),
					eq(translForForms.key, articles.preview_translation_1_key),
					eq(translForForms.key, articles.preview_translation_2_key),
					eq(translForForms.key, previewTemplates.name_translation_key)
				)
			)
			.leftJoin(tagsToArticles, eq(tagsToArticles.article_id, exisingId))
			.where(eq(articles.id, exisingId))
			.all();

		const articleResult = results[0].articles;
		const translationsArr = results
			.map((rows) => rows.translations)
			.filter(getNullAndDupFilter('key'));
		const imagesArr = results.map((rows) => rows.images).filter(getNullAndDupFilter('id'));
		const translationsForForms = results
			.map((rows) => rows.translForForms)
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
						components: { static: null, editor: null, dynamic: null },
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
						return [
							key,
							await superValidate(translation, zod(translationUpdateSchema), {
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
		return db
			.update(articles)
			.set(article)
			.where(and(eq(articles.slug, slug), eq(articles.user_id, actor.id)))
			.returning({ slug: articles.slug })
			.get();
	}
	async publish(slug: string) {
		const actor = await this.actorService.getOrThrow();
		return db
			.update(articles)
			.set({ publish_time: new Date() })
			.where(and(eq(articles.slug, slug), eq(articles.user_id, actor.id)))
			.returning({ slug: articles.slug })
			.get();
	}
	async hide(slug: string) {
		const actor = await this.actorService.getOrThrow();
		return db
			.update(articles)
			.set({ publish_time: null })
			.where(and(eq(articles.slug, slug), eq(articles.user_id, actor.id)))
			.returning({ slug: articles.slug })
			.get();
	}
	async delete(slug: string) {
		const actor = await this.actorService.getOrThrow();
		const articleDeleted = await db
			.delete(articles)
			.where(and(eq(articles.slug, slug), eq(articles.user_id, actor.id)))
			.returning({ id: articles.id })
			.get();
		if (!articleDeleted) throw new Error('Article not found');
		await this.imageService.delete(articleDeleted.id, 'with-record');
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
			const provider = (await new ServerImageHandler().setProviderAndUploader(actor)).provider;
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

		const whereCondition = and(eq(articles.slug, slug), eq(articles.user_id, actor.id));
		const articleUpdatePromise = db.update(articles).set(preview).where(whereCondition).run();
		const promisesToWaitFor: Promise<ResultSet | void>[] = [articleUpdatePromise];

		// 2. Upload images if present and update records
		// TODO: There were validImage field in ImageHandler, we replaced
		// for just imageHandler presence, check if everything works ok still
		const validImagesPresent = Object.entries(imageHandlers).some(([key, imageHandler]) => {
			imageHandler && !keysForDeletion.find((k) => k === `delete_${key}`);
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
					if (imageHandler && !keysForDeletion.find((k) => k === `delete_${fieldName}`)) {
						await imageHandler.setProviderAndUploader(actor);
						const record = await imageHandler.upload({
							imageId: articleRecord[fieldNameWithIdPrefix],
							lang
						});
						await this.imageService.update(record.record, lang);
					}
				}
			);
			const deletionPromises = keysForDeletion.map((key) => {
				const keyDeprefixed = key.replace('delete_', '') as ArticlePreviewImageFileFieldNamesAll;
				const { fieldNameWithIdPrefix, lang } = decomposeImageField(keyDeprefixed);

				return this.imageService.delete(articleRecord[fieldNameWithIdPrefix], 'path-only', lang);
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
					or(eq(images.id, articles.preview_image_1_id), eq(images.id, articles.preview_image_2_id))
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
					translationsArr.find((t) => t.key === preview_translation_1_key)?.[
						this.translationService.currentLang
					] || '';
				const preview_translation_2 =
					translationsArr.find((t) => t.key === preview_translation_2_key)?.[
						this.translationService.currentLang
					] || '';
				const titleTranslationObj = translationsArr.find((t) => t.key === title_translation_key);

				const { width, height } = calculateDimensionsFromCellsTaken({
					preview_columns,
					preview_rows
				});
				const preview_image_1 = getMaybeTranslatedImagePath(
					imagesArr,
					translationsArr,
					preview_image_1_id,
					this.translationService.currentLang
				);
				const preview_image_2 = getMaybeTranslatedImagePath(
					imagesArr,
					translationsArr,
					preview_image_2_id,
					this.translationService.currentLang
				);
				const url = composeURLForScreenshot(previewTemplateUrl, {
					width,
					height,
					lang: this.translationService.currentLang,
					preview_prop_1: preview.preview_prop_1 || null,
					preview_prop_2: preview.preview_prop_2 || null,
					preview_translation_1,
					preview_translation_2,
					preview_image_1,
					preview_image_2
				});

				// Creating screenshot image record if needed
				if (!preview_screenshot_image_id) {
					const newImageRecord = await this.imageService.create({ source });
					preview_screenshot_image_id = newImageRecord.id;
					await db
						.update(articles)
						.set({ preview_screenshot_image_id: newImageRecord.id })
						.where(whereCondition);
				}

				if (preview_screenshot_image_id && providerData) {
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
										imageProviderData: providerData
									};
								} else {
									return null;
								}
							})
							.filter(isNonNullable);
						if (queueRecordsForInsert.length === 0) {
							fail(403, { message: ERRORS.AT_LEAST_ONE_TITLE });
						}
					} else {
						queueRecordsForInsert = [
							{
								image_id,
								width,
								height,
								url,
								imageProviderData: providerData
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
	}
	async getOne(username: string, slug: string) {
		const actor = await this.actorService.get();
		const titleTranslationAlias = alias(translations, 'title_translation');
		const query = await db
			.select({
				articles: articles,
				titleTranslationAlias,
				translations: {
					key: translations.key,
					[this.translationService.currentLang]: translations[this.translationService.currentLang]
				},
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
			previewType: query[0].previewTypes,
			translations: Object.fromEntries([
				...query
					.map((row) => row.translations)
					.filter(getNullAndDupFilter('key'))
					.map((row) => [row.key, row[this.translationService.currentLang]]),
				...query
					.map((row) => row.titleTranslationAlias)
					.filter(getNullAndDupFilter('key'))
					.map((row) => [row.key, row[this.translationService.currentLang]])
			]),
			images: query.map((rows) => rows.images).filter(getNullAndDupFilter('id')),
			tags: query.map((rows) => rows.tags).filter(getNullAndDupFilter('id'))
		};
	}
}
