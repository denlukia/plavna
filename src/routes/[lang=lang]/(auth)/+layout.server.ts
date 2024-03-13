import { redirect } from '@sveltejs/kit';

import { serviceTranslations } from '$lib/server/i18n';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, params, parent }) => {
	const { user } = await locals;
	if (user) redirect(302, `/${user.username}/pages`);

	const { translations } = await parent();
	return {
		translations: { ...translations, ...serviceTranslations.auth(params.lang) }
	};
}) satisfies LayoutServerLoad;
