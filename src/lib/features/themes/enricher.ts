import type { Component } from 'svelte';

import type { ThemeComponentSet, ThemeSet } from './themes';

export async function enrichThemeSet(themeSet: ThemeSet) {
	const glob = import.meta.glob('$lib/features/themes/*/*/Index.svelte');

	const categories = ['color', 'style', 'typography'] as const;

	const themeComponentSet = {} as ThemeComponentSet;

	for (const key of categories) {
		const foundEntry = Object.entries(glob).find(([path]) =>
			path.includes(`themes/${key}/${themeSet[key]}/Index.svelte`)
		);

		const errorText = `${key} theme not found`;

		if (!foundEntry) {
			throw new Error(errorText);
		}
		const [, getter] = foundEntry;
		const themeModule = await getter();

		if (
			themeModule &&
			// typeof themeModule === 'string'
			typeof themeModule === 'object' &&
			'default' in themeModule
		) {
			themeComponentSet[key] = themeModule.default as Component;
		} else {
			throw new Error(errorText);
		}
	}

	return themeComponentSet;
}
