export async function getPreviewComponent(folder: string, type: 'Static' | 'Editor' | 'Dynamic') {
	const previewComponents = import.meta.glob('../../lib/components/previews/*/*.svelte');
	const getModule = previewComponents[`../components/previews/${folder}/${type}.svelte`];
	const module = await getModule();
	if (module !== null && typeof module === 'object' && 'default' in module) {
		return module.default as ConstructorOfATypedSvelteComponent;
	}
}
