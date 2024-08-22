import { redirect } from '@sveltejs/kit';
import { getSystemTranslationsSlice } from '$lib/features/i18n/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	if (locals.actor) {
		redirect(302, `./`);
	}

	const { systemTranslations } = await parent();
	return {
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('login', params.lang)
		}
	};
};
