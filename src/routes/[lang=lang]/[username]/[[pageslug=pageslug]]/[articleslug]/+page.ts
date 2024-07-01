export const load = async ({ data }) => {
	data = structuredClone(data);
	// let previewType = data.previewType;
	// if (previewType !== null) {
	// 	previewType = previewType as PreviewTypeSelect;
	// 	previewType.component_editor = await getPreviewComponent(previewType.url, 'static');
	// }
	return { ...data };
};
