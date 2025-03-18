import { env } from '$env/dynamic/private';

import type { screenshotsQueue } from './db-schema';
import { ServerImageHandler } from './server-image-uploader';

export async function uploadScreenshot(task: typeof screenshotsQueue.$inferSelect, file: File) {
	const { image_id, lang, imageProviderData } = task;

	const imageHandler = await new ServerImageHandler();

	await imageHandler.setProviderAndUploader(imageProviderData, env.REQUEST_CREDENTIALS_URL);

	await imageHandler.setImageFromEntry(file, {
		formats: ['image/png'],
		maxSizeMb: 25
	});

	return await imageHandler.upload({ imageId: image_id, lang });
}
