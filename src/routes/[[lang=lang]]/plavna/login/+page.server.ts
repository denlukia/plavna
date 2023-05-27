// routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.auth.validateUser();
	if (session) throw redirect(302, '/');
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
			console.log(session);
			locals.auth.setSession(session);
		} catch {
			// invalid username/password
			return fail(400);
		}
	}
};
