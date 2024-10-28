import { createRecordsTranslationsState } from '$lib/features/i18n/state.svelte';
import { getPreviewComponent } from '$lib/features/preview/enricher';

import type { PageLoad } from '../[articleslug]/$types';

export const load = (async ({ data }) => {
	const { recordsTranslations, ...other } = structuredClone(data);

	const previewComponent = await getPreviewComponent(other.article.preview_family, 'viewer');
	const recordsTranslationsState = createRecordsTranslationsState(recordsTranslations);

	return { ...other, previewComponent, recordsTranslationsState };
}) satisfies PageLoad;
