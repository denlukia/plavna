import type { ServerImageHandler } from '@denlukia/plavna-common/images';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { IMAGE_CREDENTIALS_PATH } from '$lib/collections/config';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import { table_articles } from '../article/schema';
import { table_translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { ImageSelect } from '../image/parsers';
import { table_images } from '../image/schema';
import type { ImageService } from '../image/service';
import type { ActorService } from '../user/service';
import type {
	PreviewTemplateCreation,
	PreviewTemplateDeletion,
	PreviewTemplateEditing
} from './parsers';
import { table_previewTemplates } from './schema';

export class PreviewService {
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

	// TODO: Show image input only if account has Image Provider keys
	async create(template: PreviewTemplateCreation, imageHandler: ServerImageHandler | null) {
		const actor = await this.actorService.getOrThrow();
		const { url, ...translation } = template;
		await db.transaction(async (trx) => {
			const [{ key }] = await this.translationService.create([translation], 'disallow-empty', trx);
			let imageId: ImageSelect['id'] | null = null;
			if (imageHandler) {
				await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);
				const source = imageHandler.provider?.type;
				({ id: imageId } = await this.imageService.createRecord({ source }, trx));
				const { record } = await imageHandler.upload({ imageId, lang: null });
				await this.imageService.updatePath(record, null, trx);
			}
			await trx
				.insert(table_previewTemplates)
				.values({ user_id: actor.id, url, name_translation_key: key, image_id: imageId })
				.run();
		});
	}
	async update(template: PreviewTemplateEditing, imageHandler: ServerImageHandler | null) {
		const actor = await this.actorService.getOrThrow();
		const { url, template_id, ...translation } = template;
		await db.transaction(async (trx) => {
			const whereCondition = and(
				eq(table_previewTemplates.id, template_id),
				eq(table_previewTemplates.user_id, actor.id)
			);

			// 1. Update name translation and URL
			const translationResult = await trx
				.select({ key: table_translations.key })
				.from(table_previewTemplates)
				.innerJoin(
					table_translations,
					eq(table_translations.key, table_previewTemplates.name_translation_key)
				)
				.where(whereCondition)
				.get();
			if (!translationResult) {
				error(403, ERRORS.PREVIEW_TEMPLATE_NOT_FOUND);
			}

			await this.translationService.update({ ...translation, key: translationResult.key }, trx);
			await trx.update(table_previewTemplates).set({ url }).where(whereCondition);

			// 2. Create/Upload/Update image
			if (imageHandler) {
				const imageResult = await trx
					.select({ id: table_images.id })
					.from(table_previewTemplates)
					.innerJoin(table_images, eq(table_images.id, table_previewTemplates.image_id))
					.where(whereCondition)
					.get();
				await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);
				const source = imageHandler.provider?.type;
				let imageId: ImageSelect['id'] | undefined = imageResult?.id;
				if (!imageId) {
					({ id: imageId } = await this.imageService.createRecord({ source }, trx));
					await trx.update(table_previewTemplates).set({ image_id: imageId }).where(whereCondition);
				}
				const { record } = await imageHandler.upload({ imageId, lang: null });
				await this.imageService.updatePath(record, null, trx);
			}
		});
	}
	async delete(template: PreviewTemplateDeletion) {
		const actor = await this.actorService.getOrThrow();
		await db.transaction(async (trx) => {
			const whereCondition = and(
				eq(table_previewTemplates.id, template.id),
				eq(table_previewTemplates.user_id, actor.id)
			);
			const recordResult = await trx
				.select({ translation_key: table_translations.key, images: table_images })
				.from(table_previewTemplates)
				.innerJoin(
					table_translations,
					eq(table_translations.key, table_previewTemplates.name_translation_key)
				)
				.leftJoin(table_images, eq(table_images.id, table_previewTemplates.image_id))
				.where(whereCondition)
				.get();
			if (recordResult?.translation_key) {
				await this.translationService.delete({ key: recordResult.translation_key }, trx);
				await trx
					.update(table_articles)
					.set({ preview_family: null })
					.where(eq(table_articles.preview_template_id, template.id));
			} else {
				error(403, ERRORS.PREVIEW_TEMPLATE_NOT_FOUND);
			}
			if (recordResult.images) {
				if (recordResult.images.path) {
					// TODO: Folder deletion
				}
				await this.imageService.deleteRecord(recordResult.images.id, trx);
			}
			await trx.delete(table_previewTemplates).where(whereCondition).run();
		});
	}
}
