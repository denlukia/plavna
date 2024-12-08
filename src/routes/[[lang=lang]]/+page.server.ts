import { getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import { lucia } from '$lib/services/auth';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { lang }, parent, route }) => {
	const { systemTranslations } = await parent();
	const routeId = route.id;

	return {
		routeId,
		lang,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('main', lang)
		}
	};
};

export const actions: Actions = {
	default: async (event) => {
		const session = event.locals.session;
		if (session) {
			await lucia.invalidateSession(session.id);
		}

		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
};
