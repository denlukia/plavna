import type { ServerImageHandler } from '@denlukia/plavna-common/server';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import { articles } from '../article/schema';
import type { UserService } from '../auth/service';
import { translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { ImageSelect } from '../image/parsers';
import { images } from '../image/schema';
import type { ImageService } from '../image/service';
import type {
	PreviewTemplateCreation,
	PreviewTemplateDeletion,
	PreviewTemplateEditing
} from './parsers';
import { previewTemplates } from './schema';

export class PreviewService {
	private readonly userService: UserService;
	private readonly translationService: TranslationService;
	private readonly imageService: ImageService;

	constructor(
		userService: UserService,
		translationService: TranslationService,
		imageService: ImageService
	) {
		this.userService = userService;
		this.translationService = translationService;
		this.imageService = imageService;
	}

	// TODO: Show image input only if account has Image Provider keys
	async create(template: PreviewTemplateCreation, imageHandler: ServerImageHandler | null) {
		const user = await this.userService.getOrThrow();
		const { url, ...translation } = template;
		await db.transaction(async (trx) => {
			const [{ key }] = await this.translationService.create([translation], 'disallow-empty', trx);
			let imageId: ImageSelect['id'] | null = null;
			if (imageHandler) {
				const source = (await imageHandler.setProviderAndUploader(user)).provider?.type;
				({ id: imageId } = await this.imageService.create({ source }, trx));
				const { record } = await imageHandler.upload({ imageId, lang: null });
				await this.imageService.update(record, null, trx);
			}
			await trx
				.insert(previewTemplates)
				.values({ user_id: user.id, url, name_translation_key: key, image_id: imageId })
				.run();
		});
	}
	async update(template: PreviewTemplateEditing, imageHandler: ServerImageHandler | null) {
		const user = await this.userService.getOrThrow();
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

			await this.translationService.update({ ...translation, key: translationResult.key }, trx);
			await trx.update(previewTemplates).set({ url }).where(whereCondition);

			// 2. Create/Upload/Update image
			if (imageHandler) {
				const imageResult = await trx
					.select({ id: images.id })
					.from(previewTemplates)
					.innerJoin(images, eq(images.id, previewTemplates.image_id))
					.where(whereCondition)
					.get();
				const source = (await imageHandler.setProviderAndUploader(user)).provider?.type;

				let imageId: ImageSelect['id'] | undefined = imageResult?.id;
				if (!imageId) {
					({ id: imageId } = await this.imageService.create({ source }, trx));
					await trx.update(previewTemplates).set({ image_id: imageId }).where(whereCondition);
				}
				const { record } = await imageHandler.upload({ imageId, lang: null });
				await this.imageService.update(record, null, trx);
			}
		});
	}
	async delete(template: PreviewTemplateDeletion) {
		const user = await this.userService.getOrThrow();
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
				await this.translationService.delete({ key: recordResult.translation_key }, trx);
				await trx
					.update(articles)
					.set({ preview_family: null })
					.where(eq(articles.preview_template_id, template.id));
			} else {
				error(403, ERRORS.PREVIEW_TEMPLATE_NOT_FOUND);
			}
			if (recordResult) {
				if (recordResult.images.path) {
					// TODO: Folder deletion
				}
				await this.imageService.delete(recordResult.images.id, undefined, trx);
			}
			await trx.delete(previewTemplates).where(whereCondition).run();
		});
	}
}
