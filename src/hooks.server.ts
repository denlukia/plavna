import { auth } from '$lib/server/services/auth';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const authRequest = auth.handleRequest(event);

	event.locals.auth = authRequest;
	return await resolve(event);
};
