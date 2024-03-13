import { serviceTranslations } from '$lib/server/i18n';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { translations } = await parent();
	return {
		translations: { ...translations, ...serviceTranslations.login(params.lang) }
	};
};
