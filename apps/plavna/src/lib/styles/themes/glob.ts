export function getThemeStylesGlob() {
	return import.meta.glob('./*/*/Index.svelte');
}
