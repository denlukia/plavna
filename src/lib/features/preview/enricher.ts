import type { Component } from 'svelte';

import type { PreviewFamiliesDict, PreviewFamilyId } from './families/types';

export async function getPreviewComponent(folder: string, type: 'Static' | 'Editor' | 'Dynamic') {
	const previewComponents = import.meta.glob('$lib/features/preview/families/*/*.svelte');
	const moduleSearchString = `${folder}/${type}.svelte`;
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

export async function enrichPreviewFamilies(previewFamilies: PreviewFamiliesDict) {
	for (const previewFamily in previewFamilies) {
		const previewFamilyTyped = previewFamily as PreviewFamilyId;

		const component = await getPreviewComponent(previewFamily, 'Static');
		if (!component) continue;

		previewFamilies[previewFamilyTyped].components = {
			...previewFamilies[previewFamilyTyped].components,
			Static: component
		};
	}
	return previewFamilies;
}
