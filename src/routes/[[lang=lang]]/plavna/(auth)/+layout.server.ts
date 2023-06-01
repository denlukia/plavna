import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { transGroups } from '$lib/server/i18n';

export const load = (async ({ locals, params, parent }) => {
	const { session, user } = await locals.auth.validateUser();
	if (session) throw redirect(302, `/${user.username}/pages`);

	const { translations } = await parent();
	return {
		translations: { ...translations, ...transGroups.auth(params.lang) }
	};
}) satisfies LayoutServerLoad;
