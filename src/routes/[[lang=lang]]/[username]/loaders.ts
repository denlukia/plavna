import { getPreviewComponent } from '$lib/isomorphic/preview-loader';

import type {
	PageLoad as DefaultPageLoad,
	PageServerLoad as DefaultPageServerLoad
} from './$types';
import type { PageLoad as PostLoad, PageServerLoad as PostServerLoad } from './[slug]/$types';
import type {
	PageLoad as PostEditLoad,
	PageServerLoad as PostEditServerLoad
} from './[slug]/edit/$types';
import type {
	PageLoad as NamedPageLoad,
	PageServerLoad as NamedPageServerLoad
} from './page-[pagename]/$types';

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

// Page Viewer ---------------------------------------------------------------
type PageViewerServerLoadEvent =
	| Parameters<DefaultPageServerLoad>[0]
	| Parameters<NamedPageServerLoad>[0];
type PageViewerServerLoad = DefaultPageServerLoad | NamedPageServerLoad;

type PageViewerLoadEvent = Parameters<DefaultPageLoad> | Parameters<NamedPageLoad>;
type PageViewerLoad = DefaultPageLoad | NamedPageLoad;

export const pageServerLoad = (async ({
	params,
	parent,
	locals: { plavna }
}: PageViewerServerLoadEvent) => {
	const { username } = params;

	let pagename = '';
	if ('pagename' in params) {
		pagename = params.pagename;
	}

	const response = await plavna.pages.getOneWithSectionsAndPosts(username, pagename);
	const { translations } = await parent();
	// return { ...other, translations: { ...translations, ...newTranslations } };
}) satisfies PageViewerServerLoad;
