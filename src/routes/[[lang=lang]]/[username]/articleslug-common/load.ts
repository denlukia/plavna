import { createRecordsTranslationsState } from '$lib/features/i18n/state.svelte';
import { createImagesState } from '$lib/features/image/state.svelte';
import { getPreviewComponent } from '$lib/features/preview/enricher';

import type { PageLoad } from '../[articleslug]/$types';

export const load = (async ({ data, route }) => {
	const { recordsTranslations, images, ...other } = structuredClone(data);

	const previewComponent = await getPreviewComponent(other.article.preview_family, 'viewer');
	const recordsTranslationsState = createRecordsTranslationsState(recordsTranslations);
	const imagesDict = Object.fromEntries(images.map(({ id, ...other }) => [id, other]));
	const imagesState = createImagesState(imagesDict);
	const routeId = route.id;

	return { ...other, previewComponent, recordsTranslationsState, imagesState, routeId };
}) satisfies PageLoad;
