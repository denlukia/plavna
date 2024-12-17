import type { SystemTranslationSliceKey } from '$lib/features/i18n/types';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';

import type { PageServerLoad } from '../[articleslug]/$types';

export const load = (async ({
	route,
	params,
	parent,
	locals: { articleService, lang, actorService }
}) => {
	const { translations, ...other } = await articleService.getOne(
		params.username,
		params.articleslug
	);
	const actor = await actorService.get();

	const { systemTranslations } = await parent();
	const routeId = route.id;

	const translationSlicesKeys: SystemTranslationSliceKey[] = ['article'];

	if (actor && params.username === actor.username) {
		translationSlicesKeys.push('article_actor');
	}

	return {
		...other,
		routeId,
		lang,
		recordsTranslations: translations,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice(translationSlicesKeys, getLang(params.lang))
		}
	};
}) satisfies PageServerLoad;
