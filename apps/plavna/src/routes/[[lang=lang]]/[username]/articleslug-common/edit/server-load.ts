import { getLang, getSystemTranslationsSlice } from '$lib/i18n/utils';

import type { PageServerLoad } from '../../[articleslug]/edit/$types';

export const load = (async ({ route, params, parent, locals: { articleService, lang } }) => {
	const { translations: newTranslations, ...other } = await articleService.loadEditor(
		params.username,
		params.articleslug
	);
	const { systemTranslations } = await parent();
	const routeId = route.id;

	return {
		...other,
		routeId,
		lang,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('article_editor', getLang(params.lang))
		},
		recordsTranslations: newTranslations
	};
}) satisfies PageServerLoad;
