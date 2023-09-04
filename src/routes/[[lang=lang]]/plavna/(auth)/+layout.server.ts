import { redirect } from '@sveltejs/kit';

import { serviceTranslations } from '$lib/server/i18n';

import type { LayoutServerLoad } from './$types';
import { defaultLang } from '$lib/isomorphic/languages';

export const load = (async ({ locals, params, parent }) => {
	const session = await locals.authRequest.validate();
	if (session) throw redirect(302, `/${session.user.username}/pages`);

	const { translations } = await parent();
	return {
		translations: { ...translations, ...serviceTranslations.auth(params.lang || defaultLang) }
	};
}) satisfies LayoutServerLoad;
