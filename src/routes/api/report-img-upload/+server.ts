import { SCREENSHOTTER_ACCESS_COOKIE_NAME } from '@denlukia/plavna-common/constants';
import type { ImageProcessed, SupportedLang } from '@denlukia/plavna-common/types';
import { error, text } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const body: ImageProcessed = await request.json();
	const { userService, imageService } = locals;

	const user = await userService.get();
	const accessCookie = cookies.get(SCREENSHOTTER_ACCESS_COOKIE_NAME);

	if (accessCookie !== env.SCREENSHOTTER_ACCESS_TOKEN && !user) {
		error(403);
	}

	try {
		await imageService.update(
			body.record,
			body.lang as SupportedLang,
			undefined,
			'from-screenshotter'
		);
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
