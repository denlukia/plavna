import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';

import type { PageServerLoad } from '../[articleslug]/$types';

export const load = (async ({ params, parent, locals: { articleService } }) => {
	const { translations, ...other } = await articleService.getOne(
		params.username,
		params.articleslug
	);

	const { systemTranslations } = await parent();

	return {
		...other,
		recordsTranslations: translations,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('article', getLang(params.lang))
		}
	};
}) satisfies PageServerLoad;
