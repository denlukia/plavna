import { enrichPreviewFamilies } from '$lib/features/preview/enricher';

import type { PageLoad } from '../$types';

export const load = (async ({ data }) => {
	const { previewFamilies, ...pageData } = structuredClone(data);

	const enriched = await enrichPreviewFamilies(previewFamilies, 'viewer');

	return { ...pageData, previewFamilies: enriched };
}) satisfies PageLoad;
