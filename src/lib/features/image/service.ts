import type { SupportedLang } from '@denlukia/plavna-common/types';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/services/db';

import type { UserService } from '../auth/service';
import type { TransactionContext } from '../common/types';
import type { TranslationSelect } from '../i18n/parsers';
import { translations } from '../i18n/schemas';
import type { TranslationService } from '../i18n/service';
import type { ImageInsert, ImageSelect, ImageUpdate } from './parsers';
import { images } from './schemas';
import type { ImageAnyParams, ImageCreationParams, ImagesUpdateParams } from './types';

export class ImageService {
	private readonly userService: UserService;
	private readonly translationService: TranslationService;

	constructor(userService: UserService, translationService: TranslationService) {
		this.userService = userService;
		this.translationService = translationService;
	}

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
				await this.translationService.update({ [lang]: path, key: translation.key }, trx);
			} else {
				await this.translationService.delete({ key: translation.key }, trx);
			}
		} else {
			if (lang) {
				[translation] = await this.translationService.create([{ [lang]: path }], undefined, trx);
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

	async create(newImage: ImageInsert, trx?: TransactionContext) {
		const chosenDBInstance = trx || db;
		const user = await this.userService.getOrThrow();

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
	}
	async update(newImage: ImageUpdate, lang: SupportedLang | null, trx?: TransactionContext) {
		const chosenDBInstance = trx || db;
		const user = await this.userService.getOrThrow();

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
	}
	async delete(imageId: ImageSelect['id'], lang?: SupportedLang | null, trx?: TransactionContext) {
		const chosenDBInstance = trx || db;
		const user = await this.userService.getOrThrow();
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
				await this.translationService.update(
					{ [lang]: null, key: translation.translations.key },
					trx
				);
			}
		} else if (mode === 'default-deletion') {
			await chosenDBInstance.update(images).set({ path: null }).where(whereCondition).run();
		} else {
			if (translation) {
				await this.translationService.delete({ key: translation.translations.key }, trx);
			}
			await chosenDBInstance.delete(images).where(whereCondition).run();
		}
	}
}
