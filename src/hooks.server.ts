import { ServerImageHandler } from 'plavna-common';

import { auth } from '$lib/server/services/auth';
import Plavna from '$lib/server/services/plavna';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const authRequest = auth.handleRequest(event);
	event.locals.authRequest = authRequest;

	const imageHandler = new ServerImageHandler();
	event.locals.imageHandler = imageHandler;

	const plavnaService = new Plavna(authRequest, event.params.lang, imageHandler);
	event.locals.plavna = plavnaService;

	return await resolve(event);
};
