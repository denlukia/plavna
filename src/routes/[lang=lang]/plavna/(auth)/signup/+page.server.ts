import { fail } from '@sveltejs/kit';

import { serviceTranslations } from '$lib/server/i18n';
import { auth } from '$lib/server/services/auth';

export const load = async ({ parent, params }) => {
	const { translations } = await parent();
	return {
		translations: { ...translations, ...serviceTranslations.signup(params.lang) }
	};
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
				key: {
					providerId: 'username',
					providerUserId: username,
					password
				},
				attributes: {
					username
				}
			});
			const session = await auth.createSession({ userId: user.id, attributes: {} });
			locals.authRequest.setSession(session);
		} catch (e) {
			console.log(e);
			// username taken
			return fail(400);
		}
	}
};
