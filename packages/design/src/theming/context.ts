import { getContext, setContext } from 'svelte';

import type { ThemeSet } from '.';

const contextName = 'themeSet';

export function createThemeContext(themeSet: ThemeSet) {
	return setContext(contextName, themeSet);
}
export function getThemeContext() {
	return getContext<ThemeSet | undefined>(contextName);
}
