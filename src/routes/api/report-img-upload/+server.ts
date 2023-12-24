import { SCREENSHOTTER_ACCESS_TOKEN } from '$env/static/private';
import { SCREENSHOTTER_ACCESS_COOKIE_NAME } from '@denlukia/plavna-common/constants';
import { error, text } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import type { ImageProcessed } from '@denlukia/plavna-common/types';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const body: ImageProcessed = await request.json();
	const { plavna } = locals;

	const user = await plavna.user.get();
	const accessCookie = cookies.get(SCREENSHOTTER_ACCESS_COOKIE_NAME);
	if (accessCookie !== SCREENSHOTTER_ACCESS_TOKEN && !user) {
		error(403);
	}

	try {
		await plavna.images.update(body.record, body.lang);
		return text('OK');
	} catch (e) {
		console.error(e);
		if (e !== null && typeof e === 'object' && 'status' in e) {
			throw e;
		} else {
			error(500, 'Internal server error');
		}
	}
};
