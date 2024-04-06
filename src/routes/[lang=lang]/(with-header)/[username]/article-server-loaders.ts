import { getSystemTranslationsSlice } from '$lib/(features)/common/translations/_index';

import type { PageServerLoad as ArticleServerLoad } from './[slug]/$types';
import type { PageServerLoad as ArticleEditServerLoad } from './[slug]/edit/$types';

// Article Editor ---------------------------------------------------------------
export const articleEditServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.articles.loadEditor(
		params.username,
		params.slug
	);
	const { systemTranslations } = await parent();

	return {
		...other,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('article_editor', params.lang)
		},
		recordsTranslations: newTranslations
	};
}) satisfies ArticleEditServerLoad;

// Article Viewer ---------------------------------------------------------------
export const articleServerLoad = (async ({ params, locals: { plavna } }) => {
	const { translations, ...other } = await plavna.articles.getOne(params.username, params.slug);

	return { ...other, recordsTranslations: translations };
}) satisfies ArticleServerLoad;
