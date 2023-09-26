import { auth } from '$lib/server/services/auth';
import Plavna from '$lib/server/services/plavna';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('GOT REQUEST');
	const authRequest = auth.handleRequest(event);
	event.locals.authRequest = authRequest;

	const plavnaService = new Plavna(authRequest, event.params.lang);
	event.locals.plavna = plavnaService;

	return await resolve(event);
};
