import { env } from '$env/dynamic/private';
import { SCREENSHOTTER_ACCESS_COOKIE_NAME } from '@denlukia/plavna-common/constants';

import type { ImagePathUpdateOrDeletion } from '@denlukia/plavna-common/types';

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
