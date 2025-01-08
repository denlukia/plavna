import type { Component } from 'svelte';

import type { ThemeComponentSet, ThemeSet } from './themes';

export async function enrichThemes(
	glob: Record<string, () => Promise<unknown>>,
	themeSet: ThemeSet
) {
	const categories = ['color', 'style', 'typography/functional', 'typography/aesthetic'] as const;
	const componentSet = {} as ThemeComponentSet;

	for (const category of categories) {
		const subPath = `themes/${category}/${themeSet[category]}/Index.svelte`;
		const foundEntry = Object.entries(glob).find(([path]) => path.includes(subPath));

		if (!foundEntry) {
			// console.warn(errorText);
			continue;
		}
		const [, getter] = foundEntry;
		const themeModule = await getter();

		if (
			themeModule &&
			// typeof themeModule === 'string'
			typeof themeModule === 'object' &&
			'default' in themeModule
		) {
			componentSet[category] = themeModule.default as Component;
		} else {
			// console.warn(errorText);
		}
	}

	return componentSet;
}
