import type { SystemTranslationSliceKey } from '$lib/i18n/types';
import { getLang, getSystemTranslationsSlice } from '$lib/i18n/utils';

import type { PageServerLoad } from '../[articleslug]/$types';

export const load = (async ({
	route,
	params,
	parent,
	locals: { articleService, lang, actorService, pageService }
}) => {
	const { translations, ...other } = await articleService.getOne(
		params.username,
		params.articleslug
	);
	const actor = await actorService.get();

	let pageslug = '';
	if ('pageslug' in params && typeof params.pageslug === 'string') {
		pageslug = params.pageslug;
	}
	const themeSet = await pageService.getThemeSet(params.username, pageslug);

	const { systemTranslations } = await parent();
	const routeId = route.id;

	const translationSlicesKeys: SystemTranslationSliceKey[] = ['article'];

	if (actor && params.username === actor.username) {
		translationSlicesKeys.push('article_actor');
	}

	return {
		...other,
		themeSet,
		routeId,
		lang,
		recordsTranslations: translations,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice(translationSlicesKeys, getLang(params.lang))
		}
	};
}) satisfies PageServerLoad;
