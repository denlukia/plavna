// routes/+page.server.ts
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { transGroups } from '$lib/server/i18n';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const { translations } = await parent();
	return {
		translations: { ...translations, ...transGroups.main(params.lang) }
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const { session } = await locals.auth.validateUser();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
	}
};
