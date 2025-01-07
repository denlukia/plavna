import { ServerImageHandler } from '@plavna/image-uploader/image-handler';
import { REQUEST_CREDENTIALS_URL } from '$env/static/private';

import type { screenshotsQueue } from './db-schema';

export async function uploadScreenshot(task: typeof screenshotsQueue.$inferSelect, file: File) {
	const { image_id, lang, imageProviderData } = task;

	const imageHandler = await new ServerImageHandler();

	imageHandler.setProviderAndUploader(imageProviderData, REQUEST_CREDENTIALS_URL);

	imageHandler.setImageFromEntry(file, {
		formats: ['image/png'],
		maxSizeMb: 25
	});

	return await imageHandler.upload({ imageId: image_id, lang });
}
