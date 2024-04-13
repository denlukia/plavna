import type { Handle } from '@sveltejs/kit';
import { lucia } from '$lib/services/auth';
import Plavna from '$lib/services/plavna';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Handling auth with Lucia
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	// 2. Adding plavna service
	const plavnaService = new Plavna(user, session, event.params.lang);
	event.locals.plavna = plavnaService;

	return await resolve(event);
};
