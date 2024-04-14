import { ServerImageHandler } from '@denlukia/plavna-common/server';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';

import type Plavna from '../page/service';

export async function updateImages({
	imagesKeys,
	rawData,
	data,
	plavna
}: {
	imagesKeys: string[];
	rawData: FormData;
	data: { id: number; [key: string]: string | number | boolean | undefined };
	plavna: Plavna;
}) {
	const imagesHandlers = {} as Record<(typeof imagesKeys)[number], ServerImageHandler>;
	const imageHandledPromises = imagesKeys.map(async (key) => {
		imagesHandlers[key] = new ServerImageHandler(rawData.get(key));
		const filePresent = imagesHandlers[key].checkPresence();
		const lang = (key.split('.')[1] || null) as SupportedLang | null;
		const markedForDeletion = key.startsWith('delete') && data[key] === true;
		if (markedForDeletion) {
			await plavna.images.delete(data.id, lang);
		} else if (filePresent) {
			await imagesHandlers[key].validate(IMG_VALIDATION_CONFIG);
			const report = await imagesHandlers[key].processAndUpload({
				imageId: data.id,
				lang: lang
			});
			await plavna.images.update(report.record, lang);
		}
	});
	await Promise.all(imageHandledPromises);
}
