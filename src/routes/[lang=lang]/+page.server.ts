// routes/+page.server.ts
import { type Actions, fail } from '@sveltejs/kit';

import { serviceTranslations } from '$lib/server/i18n';
import { auth } from '$lib/server/services/auth';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { translations } = await parent();
	return {
		translations: { ...translations, ...serviceTranslations.main(params.lang) }
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.authRequest.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.authRequest.setSession(null);
	}
};
