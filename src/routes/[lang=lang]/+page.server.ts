// routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

import { serviceTranslations } from '$lib/server/i18n';
import { lucia } from '$lib/server/services/auth';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { translations } = await parent();
	return {
		translations: { ...translations, ...serviceTranslations.main(params.lang) }
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/login');
	}
};
