import { ERRORS } from '../../collections/errors';
import type { PreviewFamiliesStore, PreviewFamilyId } from './families/types';

export async function getPreviewComponent(folder: string, type: 'Static' | 'Editor' | 'Dynamic') {
	const previewComponents = import.meta.glob('$lib/features/preview/families/*/*.svelte');
	const moduleSearchString = `${folder}/${type}.svelte`;
	const moduleKey = Object.keys(previewComponents).find((key) => key.includes(moduleSearchString));
	if (moduleKey === undefined) {
		return new Error(ERRORS.COULDNT_LOAD_PREVIEW_COMPONENT);
	}

	const module = await previewComponents[moduleKey]();
	if (module !== null && typeof module === 'object' && 'default' in module) {
		return module.default as ConstructorOfATypedSvelteComponent;
	} else {
		return new Error(ERRORS.COULDNT_LOAD_PREVIEW_COMPONENT);
	}
}

export async function enrichPreviewFamilies(previewFamilies: PreviewFamiliesStore) {
	for (const previewFamily in previewFamilies) {
		const previewFamilyTyped = previewFamily as PreviewFamilyId;

		const component = await getPreviewComponent(previewFamily, 'Static');
		if (component instanceof Error) continue;

		previewFamilies[previewFamilyTyped].components = {
			...previewFamilies[previewFamilyTyped].components,
			Static: component
		};
	}
	return previewFamilies;
}
