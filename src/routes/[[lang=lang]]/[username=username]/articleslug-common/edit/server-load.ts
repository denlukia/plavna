import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';

import type { PageServerLoad } from '../../[articleslug=articleslug]/edit/$types';

export const load: PageServerLoad = async ({ params, parent, locals: { articleService } }) => {
	const { translations: newTranslations, ...other } = await articleService.loadEditor(
		params.username,
		params.articleslug
	);
	const { systemTranslations } = await parent();

	return {
		...other,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('article_editor', getLang(params.lang))
		},
		recordsTranslations: newTranslations
	};
};
