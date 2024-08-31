import { enrichPreviewFamilies } from '$lib/features/preview/enricher';

export const load = async ({ data }) => {
	const { previewFamilies, ...pageData } = structuredClone(data);

	const enriched = await enrichPreviewFamilies(
		previewFamilies,
		'editor',
		(familyId) => familyId === pageData.meta.preview_family
	);

	return { ...pageData, previewFamilies: enriched };
};
