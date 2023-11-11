import { SCREENSHOTTER_ACCESS_TOKEN } from '$env/static/private';
import { type ImageUploadReport, SCREENSHOTTER_ACCESS_COOKIE } from '@denlukia/plavna-common';
import { error, text } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const body: ImageUploadReport = await request.json();
	const { plavna } = locals;

	const user = await plavna.user.get();
	const accessCookie = cookies.get(SCREENSHOTTER_ACCESS_COOKIE);
	if (accessCookie !== SCREENSHOTTER_ACCESS_TOKEN && !user) {
		throw error(403);
	}

	try {
		await plavna.images.processUploadReport(body);
		return text('OK');
	} catch (e) {
		console.error(e);
		if (e !== null && typeof e === 'object' && 'status' in e) {
			throw e;
		} else {
			throw error(500, 'Internal server error');
		}
	}
};
