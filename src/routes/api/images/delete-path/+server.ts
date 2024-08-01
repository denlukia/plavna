import { error, text } from '@sveltejs/kit';
import type { ImageDeletionRequest } from '$lib/features/image/types';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body: ImageDeletionRequest = await request.json();
	const { actorService, imageService } = locals;

	const user = await actorService.get();

	if (!user) {
		error(403);
	}

	try {
		await imageService.delete(body.id, 'path-only', body.lang);
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
