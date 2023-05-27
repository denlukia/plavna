// hooks.server.ts
import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const authRequest = auth.handleRequest(event);
	event.locals.auth = authRequest;
	return await resolve(event);
};
