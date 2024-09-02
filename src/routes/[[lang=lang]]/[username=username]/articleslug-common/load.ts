import type { PageLoad } from '../[articleslug=articleslug]/$types';

export const load: PageLoad = async ({ data }) => {
	data = structuredClone(data);
	// let previewType = data.previewType;
	// if (previewType !== null) {
	// 	previewType = previewType as PreviewTypeSelect;
	// 	previewType.component_editor = await getPreviewComponent(previewType.url, 'viewer');
	// }
	return { ...data };
};
