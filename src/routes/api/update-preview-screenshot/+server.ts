import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	console.log('Main service received:', request);

	return json('OK');
};
