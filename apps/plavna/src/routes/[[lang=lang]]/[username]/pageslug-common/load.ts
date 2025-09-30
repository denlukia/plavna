import { enrichThemeSets } from '@plavna/design/theming/enricher';
import { createRecordsTranslationsState } from '$lib/i18n/state.svelte';
import { createImagesState } from '$lib/image/state.svelte';
import { enrichPreviewFamilies } from '$lib/preview/enricher';
import { createPreviewFamiliesState } from '$lib/preview/families/state.svelte';
import { getAppThemeGlob } from '$lib/styles/themes/glob';

import type { PageLoad } from '../$types';

export const load = (async ({ data }) => {
	const { previewFamilies, recordsTranslations, images, themeSet, ...other } =
		structuredClone(data);

	const enriched = await enrichPreviewFamilies(previewFamilies, 'viewer');
	const previewFamiliesState = createPreviewFamiliesState(enriched);
	const recordsTranslationsState = createRecordsTranslationsState(recordsTranslations);
	const imagesState = createImagesState(images);

	const themeComponentLayers = await enrichThemeSets(themeSet, getAppThemeGlob());

	return {
		...other,
		previewFamiliesState,
		recordsTranslationsState,
		imagesState,
		themeComponentLayers,
		themeSet
	};
}) satisfies PageLoad;
