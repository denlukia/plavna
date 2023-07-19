// routes/+page.server.ts
import { type Actions, fail, redirect } from '@sveltejs/kit';

import { transGroups } from '$lib/server/i18n';
import { auth } from '$lib/server/services/auth';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const { translations } = await parent();
	return {
		translations: { ...translations, ...transGroups.main(params.lang) }
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.authRequest.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
	}
};
