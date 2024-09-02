import { enrichPreviewFamilies } from '$lib/features/preview/enricher';

import type { PageLoad } from '../../[articleslug]/edit/$types';

export const load = (async ({ data }) => {
	const { previewFamilies, ...pageData } = structuredClone(data);

	const enriched = await enrichPreviewFamilies(
		previewFamilies,
		'editor',
		(familyId) => familyId === pageData.meta.preview_family
	);

	return { ...pageData, previewFamilies: enriched };
}) satisfies PageLoad;
