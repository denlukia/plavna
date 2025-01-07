import { ServerImageHandler } from '@denlukia/plavna-common/images';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { User } from 'lucia';
import { IMAGE_CREDENTIALS_PATH, IMG_VALIDATION_CONFIG } from '$lib/collections/config';

import type { ImageService } from './service';

export async function updateImages({
	imagesKeys,
	rawData,
	data,
	imageService,
	actor
}: {
	imagesKeys: string[];
	rawData: FormData;
	data: { id: number; [key: string]: string | number | boolean | undefined };
	imageService: ImageService;
	actor: User;
}) {
	const imagesHandlers = {} as Record<(typeof imagesKeys)[number], ServerImageHandler>;
	const imageHandledPromises = imagesKeys.map(async (key) => {
		let fileIsValid = false;
		const entry = rawData.get(key);

		if (entry instanceof File && entry.size > 0) {
			try {
				const imageHandler = await new ServerImageHandler();
				await imageHandler.setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
				imagesHandlers[key] = imageHandler;
				fileIsValid = true;
			} catch {
				// TODO: Error for unsupported image
			}
		}

		// TODO: There were a check for file presence, now it throws, check if everything is ok
		const lang = (key.split('.')[1] || null) as SupportedLang | null;
		const markedForDeletion = key.startsWith('delete') && data[key] === true;
		if (markedForDeletion) {
			await imageService.updatePath({ id: data.id }, lang);
		} else if (fileIsValid) {
			await imagesHandlers[key].setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);
			const report = await imagesHandlers[key].upload({
				imageId: data.id,
				lang: lang
			});
			await imageService.updatePath(report.record, lang);
		}
	});
	await Promise.all(imageHandledPromises);
}
