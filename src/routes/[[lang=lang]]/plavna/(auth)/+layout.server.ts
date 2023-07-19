import { redirect } from '@sveltejs/kit';

import { transGroups } from '$lib/server/i18n';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, params, parent }) => {
	const session = await locals.authRequest.validate();
	if (session) throw redirect(302, `/${session.user.username}/pages`);

	const { translations } = await parent();
	return {
		translations: { ...translations, ...transGroups.auth(params.lang) }
	};
}) satisfies LayoutServerLoad;
