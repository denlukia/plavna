import { edit_article } from '$lib/article/actions';
import { createRecordsTranslationsState } from '$lib/i18n/state.svelte';
import { getSystemTranslationsSlice } from '$lib/i18n/utils';

import type { RequestEvent } from './$types';

export const load = async ({ locals: { articleService, lang }, params, parent, route }) => {
	const { articles, recordsTranslations } = await articleService.getMyAsForms(params.username);
	const { systemTranslations } = await parent();

	const routeId = route.id;

	return {
		articles,
		routeId,
		lang,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('articles_list', lang)
		},
		recordsTranslationsState: createRecordsTranslationsState(recordsTranslations)
	};
};

export const actions = {
	publish: (event) => edit_article(event, 'publish'),
	hide: (event: RequestEvent) => edit_article(event, 'hide')
};
