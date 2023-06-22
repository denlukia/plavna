// routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

import { transGroups } from '$lib/server/i18n';
import { auth } from '$lib/server/services/auth';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { translations } = await parent();
	return {
		translations: { ...translations, ...transGroups.login(params.lang) }
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');
		// check for empty values
		if (typeof username !== 'string' || typeof password !== 'string') return fail(400);
		try {
			const key = await auth.useKey('username', username, password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch {
			// invalid username/password
			return fail(400);
		}
	}
};
