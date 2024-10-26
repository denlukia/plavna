import { createRecordsTranslationsState } from '$lib/features/i18n/state.svelte';

import type { PageLoad } from '../[articleslug]/$types';

export const load = (async ({ data }) => {
	const { recordsTranslations, ...other } = structuredClone(data);
	// let previewType = data.previewType;
	// if (previewType !== null) {
	// 	previewType = previewType as PreviewTypeSelect;
	// 	previewType.component_editor = await getPreviewComponent(previewType.url, 'viewer');
	// }
	const recordsTranslationsState = createRecordsTranslationsState(recordsTranslations);

	return { ...other, recordsTranslationsState };
}) satisfies PageLoad;
