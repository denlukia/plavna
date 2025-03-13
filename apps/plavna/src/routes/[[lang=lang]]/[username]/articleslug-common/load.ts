import { enrichThemeSets } from '@plavna/design/theming/enricher';
import { createRecordsTranslationsState } from '$lib/i18n/state.svelte';
import { createImagesState } from '$lib/image/state.svelte';
import { getPreviewComponent } from '$lib/preview/enricher';
import { getAppThemeGlob } from '$lib/styles/themes/glob';

import type { PageLoad } from '../[articleslug]/$types';

export const load = (async ({ data }) => {
	const { recordsTranslations, images, themeSet, ...other } = structuredClone(data);

	const previewComponent = await getPreviewComponent(other.article.preview_family, 'viewer');
	const recordsTranslationsState = createRecordsTranslationsState(recordsTranslations);
	const imagesDict = Object.fromEntries(images.map(({ id, ...other }) => [id, other]));
	const imagesState = createImagesState(imagesDict);

	const themeComponentSets = await enrichThemeSets(themeSet, getAppThemeGlob());

	return {
		...other,
		previewComponent,
		recordsTranslationsState,
		imagesState,
		themeComponentSets,
		themeSet
	};
}) satisfies PageLoad;
