import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export async function validateRequest(request: Request) {
	try {
		const body = await request.json();
		if (!body?.accessToken) {
			throw error(400, 'Missing access token');
		}
		if (body.accessToken !== env.SCREENSHOTTER_ACCESS_TOKEN) {
			throw error(403, 'Invalid access token');
		}
	} catch (e: any) {
		if (e?.status) {
			throw e;
		} else {
			throw error(400, 'Error parsing request');
		}
	}
}
