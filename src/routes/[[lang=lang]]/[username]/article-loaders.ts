import { PREVIEW_EDITOR_PARAM_NAME } from '$lib/isomorphic/constants';
import { getPreviewComponent } from '$lib/isomorphic/preview-loader';
import type { PreviewTypeExtended } from '$lib/server/collections/types';

import type { PageLoad as ArticleLoad, PageServerLoad as ArticleServerLoad } from './[slug]/$types';
import type {
	PageLoad as ArticleEditLoad,
	PageServerLoad as ArticleEditServerLoad
} from './[slug]/edit/$types';

// Article Editor ---------------------------------------------------------------
export const articleEditServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.articles.createAndOrLoadEditor(
		params.username,
		params.slug
	);
	const { translations } = await parent();
	return { ...other, translations: { ...translations, ...newTranslations } };
}) satisfies ArticleEditServerLoad;

export const articleEditLoad = (async ({ data, url }) => {
	data = structuredClone(data);
	const previewIdFromParam = url.searchParams.get(PREVIEW_EDITOR_PARAM_NAME);
	const previewIdToShow = previewIdFromParam
		? Number(previewIdFromParam)
		: data.articlePreviewForm.data.preview_type_id;

	const previewTypeIndex = data.previews.findIndex((preview) => preview.id === previewIdToShow);

	if (previewTypeIndex !== -1) {
		const previewType = data.previews[previewTypeIndex] as PreviewTypeExtended;
		previewType.component_editor = await getPreviewComponent(previewType.url, 'Editor');
	}
	return { ...data };
}) satisfies ArticleEditLoad;

// Article Viewer ---------------------------------------------------------------
export const articleServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.articles.getOne(
		params.username,
		params.slug
	);
	const { translations } = await parent();
	return { ...other, translations: { ...translations, ...newTranslations } };
}) satisfies ArticleServerLoad;

export const articleLoad = (async ({ data }) => {
	data = structuredClone(data);
	const previewType = data.previewType as PreviewTypeExtended;
	previewType.component_editor = await getPreviewComponent(previewType.url, 'Static');
	return { ...data };
}) satisfies ArticleLoad;
