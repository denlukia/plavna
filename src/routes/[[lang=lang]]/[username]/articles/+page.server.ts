import { edit_article } from '$lib/features/article/actions';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';

import type { RequestEvent } from './$types';

export const load = async ({ locals: { articleService }, params, parent }) => {
	const forms = await articleService.getMyAsForms(params.username);
	const { systemTranslations } = await parent();

	return {
		...forms,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('articles_list', getLang(params.lang))
		}
	};
};

export const actions = {
	publish: (event) => edit_article(event, 'publish'),
	hide: (event: RequestEvent) => edit_article(event, 'hide')
};
