import { getPreviewComponent } from '$lib/isomorphic/preview-loader';

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

export const postEditLoad = (async ({ data }) => {
	const previewType = data.previews.find(
		(preview) => preview.id === data.postPreviewForm.data.preview_type_id
	);
	let previewComponent = await getPreviewComponent(previewType?.component_reference, 'Editor');
	return { ...data, previewComponent };
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
	const previewType = data.previewType;
	let previewComponent = await getPreviewComponent(previewType?.component_reference, 'Static');
	return { ...data, previewComponent };
}) satisfies PostLoad;
