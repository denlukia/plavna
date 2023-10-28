import { defaultLang } from '$lib/isomorphic/languages';
import { serviceTranslations } from '$lib/server/i18n';

import type { PageServerLoad as ArticleServerLoad } from './[slug]/$types';
import type { PageServerLoad as ArticleEditServerLoad } from './[slug]/edit/$types';

// Article Editor ---------------------------------------------------------------
export const articleEditServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.articles.loadEditor(
		params.username,
		params.slug
	);
	const { translations } = await parent();

	return {
		...other,
		translations: {
			...translations,
			...serviceTranslations.articleEditor(params.lang ?? defaultLang),
			...newTranslations
		}
	};
}) satisfies ArticleEditServerLoad;

// Article Viewer ---------------------------------------------------------------
export const articleServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.articles.getOne(
		params.username,
		params.slug
	);
	const { translations } = await parent();
	return { ...other, translations: { ...translations, ...newTranslations } };
}) satisfies ArticleServerLoad;
