import { getContext, setContext } from 'svelte';

import type { ThemeSet } from './basics';

const themeSetContextName = 'themeSet';

export function createThemeContext(themeSet: ThemeSet) {
	return setContext(themeSetContextName, themeSet);
}
export function getThemeContext() {
	return getContext<ThemeSet | undefined>(themeSetContextName);
}
