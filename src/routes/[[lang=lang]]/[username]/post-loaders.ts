import { PREVIEW_EDITOR_PARAM_NAME } from '$lib/isomorphic/constants';
import { getPreviewComponent } from '$lib/isomorphic/preview-loader';
import type { PreviewTypeExtended } from '$lib/server/collections/types';

import type { PageLoad as PostLoad, PageServerLoad as PostServerLoad } from './[slug]/$types';
import type {
	PageLoad as PostEditLoad,
	PageServerLoad as PostEditServerLoad
} from './[slug]/edit/$types';

// Post Editor ---------------------------------------------------------------
export const postEditServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.posts.createAndOrLoadEditor(
		params.username,
		params.slug
	);
	const { translations } = await parent();
	return { ...other, translations: { ...translations, ...newTranslations } };
}) satisfies PostEditServerLoad;

export const postEditLoad = (async ({ data, url }) => {
	data = structuredClone(data);
	const previewIdFromParam = url.searchParams.get(PREVIEW_EDITOR_PARAM_NAME);
	const previewIdToShow = previewIdFromParam
		? Number(previewIdFromParam)
		: data.postPreviewForm.data.preview_type_id;

	const previewTypeIndex = data.previews.findIndex((preview) => preview.id === previewIdToShow);

	if (previewTypeIndex !== -1) {
		const previewType = data.previews[previewTypeIndex] as PreviewTypeExtended;
		previewType.component_editor = await getPreviewComponent(previewType.url, 'Editor');
	}
	return { ...data };
}) satisfies PostEditLoad;

// Post Viewer ---------------------------------------------------------------
export const postServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.posts.getOne(
		params.username,
		params.slug
	);
	const { translations } = await parent();
	return { ...other, translations: { ...translations, ...newTranslations } };
}) satisfies PostServerLoad;

export const postLoad = (async ({ data }) => {
	data = structuredClone(data);
	const previewType = data.previewType as PreviewTypeExtended;
	previewType.component_editor = await getPreviewComponent(previewType.url, 'Static');
	return { ...data };
}) satisfies PostLoad;
