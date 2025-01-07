import { SCREENSHOTTER_ACCESS_COOKIE_NAME } from '@plavna/image-uploader/constants';
import type { ImagePathUpdateOrDeletion } from '@plavna/image-uploader/types';
import { env } from '$env/dynamic/private';

export async function reportScreenshotUpload(imageUpdateRequest: ImagePathUpdateOrDeletion) {
	return fetch(env.REPORT_UPLOAD_URL, {
		method: 'POST',
		headers: {
			Cookie: `${SCREENSHOTTER_ACCESS_COOKIE_NAME}=${env.SCREENSHOTTER_ACCESS_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(imageUpdateRequest)
	});
}
