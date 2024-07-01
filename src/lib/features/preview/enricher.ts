import type { Component } from 'svelte';

import type { PreviewComponentType, PreviewFamiliesDict, PreviewFamilyId } from './families/types';

export async function getPreviewComponent(folder: string, type: PreviewComponentType) {
	const previewComponents = import.meta.glob('$lib/features/preview/families/*/*.svelte');
	const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
	const moduleSearchString = `${folder}/${typeCapitalized}.svelte`;
	const moduleKey = Object.keys(previewComponents).find((key) => key.includes(moduleSearchString));
	if (moduleKey === undefined) {
		return null;
	}

	const module = await previewComponents[moduleKey]();
	if (module !== null && typeof module === 'object' && 'default' in module) {
		return module.default as Component;
	} else {
		return null;
	}
}

export async function enrichPreviewFamilies(
	previewFamilies: PreviewFamiliesDict,
	type: PreviewComponentType,
	filter?: (familyId: PreviewFamilyId) => boolean
) {
	for (const previewFamily in previewFamilies) {
		const previewFamilyTyped = previewFamily as PreviewFamilyId;
		if (filter && !filter(previewFamilyTyped)) continue;

		const component = await getPreviewComponent(previewFamily, type);
		if (!component) continue;

		previewFamilies[previewFamilyTyped].components = {
			...previewFamilies[previewFamilyTyped].components,
			[type]: component
		};
	}
	return previewFamilies;
}
