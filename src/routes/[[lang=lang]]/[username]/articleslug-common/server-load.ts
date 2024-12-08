import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';

import type { PageServerLoad } from '../[articleslug]/$types';

export const load = (async ({ route, params, parent, locals: { articleService, lang } }) => {
	const { translations, ...other } = await articleService.getOne(
		params.username,
		params.articleslug
	);

	const { systemTranslations } = await parent();
	const routeId = route.id;

	return {
		...other,
		routeId,
		lang,
		recordsTranslations: translations,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('article_actor', getLang(params.lang))
		}
	};
}) satisfies PageServerLoad;
