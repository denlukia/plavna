import { SCREENSHOTTER_ACCESS_COOKIE_NAME } from '@denlukia/plavna-common/constants';
import type { ImagePathUpdateOrDeletion, SupportedLang } from '@denlukia/plavna-common/types';
import { error, json, type Config } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const config: Config = { runtime: 'edge', regions: ['fra1'] };

export const POST = async ({ request, locals, cookies }) => {
	const body: ImagePathUpdateOrDeletion = await request.json();
	const { actorService, imageService } = locals;

	const schreenshotterCookie = cookies.get(SCREENSHOTTER_ACCESS_COOKIE_NAME);

	if (schreenshotterCookie) {
		if (schreenshotterCookie === env.SCREENSHOTTER_ACCESS_TOKEN) {
			await actorService.setFromImageIdOrThrow(body.record.id);
		} else {
			error(403);
		}
	}

	try {
		return json(await imageService.updatePath(body.record, body.lang as SupportedLang));
	} catch (e) {
		console.error(e);
		if (e !== null && typeof e === 'object' && 'status' in e) {
			throw e;
		} else {
			error(500, 'Internal server error');
		}
	}
};
