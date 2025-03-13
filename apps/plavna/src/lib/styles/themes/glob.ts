export function getAppThemeGlob() {
	return import.meta.glob('./*/*/Index.svelte');
}
