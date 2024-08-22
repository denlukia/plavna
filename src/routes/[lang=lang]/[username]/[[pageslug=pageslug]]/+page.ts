import { enrichPreviewFamilies } from '$lib/features/preview/enricher';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const { previewFamilies, ...pageData } = structuredClone(data);

	const enriched = await enrichPreviewFamilies(previewFamilies, 'static');

	return { ...pageData, previewFamilies: enriched };
};
