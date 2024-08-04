import { ServerImageHandler } from '@denlukia/plavna-common/server';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';

import type { ImageService } from './service';

export async function updateImages({
	imagesKeys,
	rawData,
	data,
	imageService
}: {
	imagesKeys: string[];
	rawData: FormData;
	data: { id: number; [key: string]: string | number | boolean | undefined };
	imageService: ImageService;
}) {
	const imagesHandlers = {} as Record<(typeof imagesKeys)[number], ServerImageHandler>;
	const imageHandledPromises = imagesKeys.map(async (key) => {
		let fileIsValid = true;
		try {
			imagesHandlers[key] = await new ServerImageHandler().setImageFromEntry(
				rawData.get(key),
				IMG_VALIDATION_CONFIG
			);
		} catch {
			fileIsValid = false;
		}

		// TODO: There were a check for file presence, now it throws, check if everything is ok
		const lang = (key.split('.')[1] || null) as SupportedLang | null;
		const markedForDeletion = key.startsWith('delete') && data[key] === true;
		if (markedForDeletion) {
			await imageService.deleteRecord(data.id, lang);
		} else if (fileIsValid) {
			const report = await imagesHandlers[key].upload({
				imageId: data.id,
				lang: lang
			});
			await imageService.updatePath(report.record, lang);
		}
	});
	await Promise.all(imageHandledPromises);
}
