// routes/signup/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const load = async ({ locals }) => {
	const { session } = await locals.auth.validateUser();
	if (session) throw redirect(302, '/');
	return {};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		// check for empty values
		if (typeof username !== 'string' || typeof password !== 'string') {
			return fail(400);
		}

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: username,
					password
				},
				attributes: {
					username
				}
			});
			const session = await auth.createSession(user.userId);
			locals.auth.setSession(session);
		} catch {
			// username taken
			return fail(400);
		}
	}
};
