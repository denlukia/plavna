import type { SupportedLang } from '@plavna/common';
import type { ClientImageHandler as ClientImageHandlerType } from '@plavna/image-uploader/images';
import type { ImagePathUpdateOrDeletion } from '@plavna/image-uploader/types';
import { IMAGE_CREDENTIALS_PATH, IMG_VALIDATION_CONFIG } from '$lib/common/config';

import type { Actor } from '../user/validators';
import type { ImageService } from './service';
import type { ImageSelect } from './validators';

let imageHandler: ClientImageHandlerType | null = null;

export type ImageWorkConfig = {
	actor: Actor | null;
	imageId: ImageSelect['id'];
	lang: SupportedLang | null;
	setProcessing?: (processing: boolean) => void;
	setErrors?: (errors: string) => void;
	updateLocalsFromResponse?: (update: Awaited<ReturnType<ImageService['updatePath']>>) => void;
};

async function getImageHandler() {
	const { ClientImageHandler } = await import('@plavna/image-uploader/images');
	return new ClientImageHandler();
}

export async function uploadImage(file: File, config: ImageWorkConfig) {
	const { actor, imageId, lang, setProcessing, setErrors, updateLocalsFromResponse } = config;
	setProcessing?.(true);

	// 1. Perform basic checks, and initialize image uploader (if needed)

	if (!actor) throw Error('Actor not found');

	try {
		if (!imageHandler) imageHandler = await getImageHandler();
		await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);

		// 2. Validate image
		await imageHandler.setImageFromEntry(file, IMG_VALIDATION_CONFIG);

		// 3. Process and upload image
		const pathUpdate = await imageHandler.upload({ imageId: imageId, lang });

		// 4. Report image upload
		const response = await fetch('/api/images/update-path', {
			method: 'POST',
			body: JSON.stringify(pathUpdate)
		});
		if (!response.ok) {
			setErrors?.(await response.text());
		}

		// 5. Update translation and path locally
		const update: Awaited<ReturnType<ImageService['updatePath']>> = await response.json();
		updateLocalsFromResponse?.(update);
	} catch (err: unknown) {
		setErrors?.(JSON.stringify(err));
	} finally {
		setProcessing?.(false);
	}
}

export async function deleteImage(config: ImageWorkConfig) {
	const { actor, imageId, lang, setProcessing, setErrors, updateLocalsFromResponse } = config;
	setProcessing?.(true);

	// 1. Perform basic checks, and initialize image uploader (if needed)
	if (!actor) throw Error('User not found');

	// 2. Delete image from provider TODO
	// if (!imageHandler) imageHandler = await getImageHandler();
	// if (!imageHandler.provider)
	// 	await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);

	const pathUpdate: ImagePathUpdateOrDeletion = { record: { id: imageId }, lang };

	// 3. Delete image path in DB
	const response = await fetch('/api/images/update-path', {
		method: 'POST',
		body: JSON.stringify(pathUpdate)
	});
	if (!response.ok) {
		setErrors?.(await response.text());
	}

	// 4. Update translation and path locally
	const update: Awaited<ReturnType<ImageService['updatePath']>> = await response.json();
	updateLocalsFromResponse?.(update);

	// TODO: If someone throws above – we don't get to set this to false
	setProcessing?.(false);
}
