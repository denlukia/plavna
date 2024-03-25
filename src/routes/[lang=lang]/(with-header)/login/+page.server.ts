import { redirect } from '@sveltejs/kit';

import { serviceTranslations } from '$lib/server/i18n';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	if (locals.user) {
		redirect(302, `./`);
	}

	const { translations } = await parent();
	return {
		translations: { ...translations, ...serviceTranslations.login(params.lang) }
	};
};
