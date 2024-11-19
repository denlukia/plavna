import type { SupportedLang } from '@denlukia/plavna-common/types';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/services/db';

import type { TransactionOrDB } from '../common/types';
import type { TranslationSelect } from '../i18n/parsers';
import { table_translations } from '../i18n/schema';
import type { TranslationService } from '../i18n/service';
import type { ActorService } from '../user/service';
import type { ImageInsertForm, ImageSelect, ImageUpdate } from './parsers';
import { table_images } from './schema';

export class ImageService {
	private readonly actorService: ActorService;
	private readonly translationService: TranslationService;

	constructor(actorService: ActorService, translationService: TranslationService) {
		this.actorService = actorService;
		this.translationService = translationService;
	}

	async createRecord(newImage: ImageInsertForm, trx: TransactionOrDB = db) {
		const actor = await this.actorService.getOrThrow();

		return trx
			.insert(table_images)
			.values({ ...newImage, user_id: actor.id })
			.returning()
			.get();
	}
	async updatePath(newImage: ImageUpdate, lang: SupportedLang | null, trx: TransactionOrDB = db) {
		const actor = await this.actorService.getOrThrow();

		const current = await trx
			.select()
			.from(table_images)
			.leftJoin(table_translations, eq(table_images.path_translation_key, table_translations.key))
			.where(and(eq(table_images.user_id, actor.id), eq(table_images.id, newImage.id)))
			.get();

		if (!current) {
			error(403);
		}
		const { images: currentImage, translations: currentTranslation } = current;
		const { path_translation_key } = currentImage;
		let finalTranslation: TranslationSelect | null = currentTranslation;

		if (lang) {
			if (path_translation_key !== null) {
				finalTranslation = await this.translationService.update(
					{ key: path_translation_key, [lang]: newImage.path || null },
					trx,
					actor
				);
			} else {
				[finalTranslation] = await this.translationService.create(
					[{ [lang]: newImage.path || null }],
					'disallow-empty',
					trx,
					actor
				);
			}
		}
		// else {
		// 	if (path_translation_key) {
		// 		await this.translationService.delete({ key: path_translation_key }, trx);
		// 	}
		// }

		// TODO: Delete old image from provider

		const updateObj: ImageUpdate = {
			...newImage
		};
		if (lang) {
			updateObj.path_translation_key = finalTranslation?.key || null;
			updateObj.path = currentImage.path;
		} else {
			updateObj.path = newImage.path || null;
		}

		const finalImage = await trx
			.update(table_images)
			.set(updateObj)
			.where(and(eq(table_images.user_id, actor.id), eq(table_images.id, currentImage.id)))
			.returning()
			.get();

		return { image: finalImage, translation: finalTranslation };
	}
	async deleteRecord(imageId: ImageSelect['id'], trx: TransactionOrDB = db) {
		const actor = await this.actorService.getOrThrow();

		const whereCondition = and(eq(table_images.user_id, actor.id), eq(table_images.id, imageId));

		const translation = await trx
			.select({ translations: table_translations })
			.from(table_images)
			.innerJoin(table_translations, eq(table_translations.key, table_images.path_translation_key))
			.where(whereCondition)
			.get();

		// TODO: Delete all images from provider

		if (translation) {
			await this.translationService.delete({ key: translation.translations.key }, trx);
		}
		await trx.delete(table_images).where(whereCondition).run();
	}
}
