import { ERRORS } from '../../collections/errors';

export async function getPreviewComponent(folder: string, type: 'Static' | 'Editor' | 'Dynamic') {
	const previewComponents = import.meta.glob('$lib/features/preview/families/*/*.svelte');
	const moduleSearchString = `preview/families/${folder}/${type}.svelte`;
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
