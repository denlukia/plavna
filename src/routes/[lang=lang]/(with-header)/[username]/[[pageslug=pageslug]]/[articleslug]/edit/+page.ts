export const load = async ({ data, url }) => {
	const previewComponents = data.previewFamilies.reduce(
		(acc, family) => ({ ...acc, [family.id]: {} }),
		{} as PreviewComponents
	);

	const previewFamilyId = url.searchParams.get(PREVIEW_FAMILY_PARAM) ?? data.meta.preview_family;
	const previewFamilyIndex = data.previewFamilies.findIndex(
		(family) => family.id === previewFamilyId
	);

	if (previewFamilyIndex !== -1) {
		const previewFamily = data.previewFamilies[previewFamilyIndex];
		previewComponents[previewFamily.id].editor = await getPreviewComponent(
			previewFamily.id,
			'Editor'
		);
	}

	return { ...data, previewComponents };
};
