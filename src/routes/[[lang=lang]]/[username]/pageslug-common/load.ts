import { createRecordsTranslationsState } from '$lib/features/i18n/state.svelte';
import { createImagesState } from '$lib/features/image/state.svelte';
import { enrichPreviewFamilies } from '$lib/features/preview/enricher';
import { createPreviewFamiliesState } from '$lib/features/preview/families/state.svelte';

import type { PageLoad } from '../$types';

export const load = (async ({ data, route }) => {
	const { previewFamilies, recordsTranslations, images, ...pageData } = structuredClone(data);

	const enriched = await enrichPreviewFamilies(previewFamilies, 'viewer');
	const previewFamiliesState = createPreviewFamiliesState(enriched);
	const recordsTranslationsState = createRecordsTranslationsState(recordsTranslations);
	const imagesState = createImagesState(images);
	const routeId = route.id;

	return { ...pageData, previewFamiliesState, recordsTranslationsState, imagesState, routeId };
}) satisfies PageLoad;
