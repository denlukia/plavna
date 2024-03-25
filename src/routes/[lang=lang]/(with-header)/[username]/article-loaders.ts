import { PREVIEW_FAMILY_PARAM } from '$lib/isomorphic/constants';
import { getPreviewComponent } from '$lib/isomorphic/preview-loader';
import type { PreviewComponents } from '$lib/server/collections/types';

import type { PageLoad as ArticleLoad } from './[slug]/$types';
import type { PageLoad as ArticleEditLoad } from './[slug]/edit/$types';

// Article Editor ---------------------------------------------------------------
export const articleEditLoad = (async ({ data, url }) => {
	const previewComponents = data.previewFamilies.reduce(
		(acc, family) => ({ ...acc, [family.id]: {} }),
		{} as PreviewComponents
	);

	const previewFamilyId = url.searchParams.get(PREVIEW_FAMILY_PARAM) ?? data.meta.preview_family;
	const previewFamilyIndex = data.previewFamilies.findIndex(
		(family) => family.id === previewFamilyId
	);

	if (previewFamilyIndex !== -1) {
		const previewFamily = data.previewFamilies[previewFamilyIndex];
		previewComponents[previewFamily.id].editor = await getPreviewComponent(
			previewFamily.id,
			'Editor'
		);
	}

	return { ...data, previewComponents };
}) satisfies ArticleEditLoad;

// Article Viewer ---------------------------------------------------------------
export const articleLoad = (async ({ data }) => {
	data = structuredClone(data);
	// let previewType = data.previewType;
	// if (previewType !== null) {
	// 	previewType = previewType as PreviewTypeSelect;
	// 	previewType.component_editor = await getPreviewComponent(previewType.url, 'Static');
	// }
	return { ...data };
}) satisfies ArticleLoad;
