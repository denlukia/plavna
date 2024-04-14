import type { Handle } from '@sveltejs/kit';
import { UserService } from '$lib/features/auth/service';
import { TranslationService } from '$lib/features/i18n/service';
import { PageService } from '$lib/features/page/service';
import { SectionService } from '$lib/features/section/service';
import { lucia } from '$lib/services/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, params } = event;

	locals.session = null;
	locals.user = null;

	// 1. Handling auth with Lucia
	const sessionId = cookies.get(lucia.sessionCookieName);
	if (sessionId) {
		const { session, user } = await lucia.validateSession(sessionId);
		locals.session = session;
		locals.user = user;

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
	}

	// 2. Adding our Services
	locals.userService = new UserService(locals.user);
	locals.translationService = new TranslationService(locals.userService, params.lang);
	locals.pageService = new PageService(locals.userService, locals.translationService);
	locals.sectionService = new SectionService(locals.userService, locals.translationService);

	// const plavnaService = new Plavna(user, session, params.lang);
	// locals.plavna = plavnaService;

	return await resolve(event);
};
