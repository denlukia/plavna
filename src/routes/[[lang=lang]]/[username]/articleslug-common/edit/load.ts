import { enrichPreviewFamilies } from '$lib/features/preview/enricher';

import type { PageLoad } from '../../[articleslug]/edit/$types';

export const load = (async ({ data, route }) => {
	const { previewFamilies, ...pageData } = structuredClone(data);

	const enriched = await enrichPreviewFamilies(
		previewFamilies,
		'editor',
		(familyId) => familyId === pageData.meta.preview_family
	);
	const routeId = route.id;

	return { ...pageData, previewFamilies: enriched, routeId };
}) satisfies PageLoad;
