import type { Component } from 'svelte';

import type { ThemeComponentSet, ThemeComponentSets, ThemeSet } from './themes';

export async function enrichThemes(
	glob: Record<string, () => Promise<unknown>> | null,
	themeSet: ThemeSet
) {
	const categories = ['color', 'style', 'typographyInterface', 'typographyMarkdown'] as const;
	const componentSet = {} as ThemeComponentSet;

	for (const category of categories) {
		const folder = category.includes('typography') ? 'typography' : category;
		const subPath = `${folder}/${themeSet[category]}/Index.svelte`;
		const finalGlob = glob || import.meta.glob('./themes/*/*/Index.svelte');

		const foundEntry = Object.entries(finalGlob).find(([path]) => path.includes(subPath));

		if (!foundEntry) {
			continue;
		}
		const [, getter] = foundEntry;
		const themeModule = await getter();

		if (themeModule && typeof themeModule === 'object' && 'default' in themeModule) {
			componentSet[category] = themeModule.default as Component;
		}
	}

	return componentSet;
}

export async function enrichThemeSets(
	themeSet: ThemeSet | null,
	appStylesGlob: Record<string, () => Promise<unknown>>
) {
	if (!themeSet) {
		return null;
	}

	const fileSets = { designSystem: null, app: appStylesGlob };

	const themeComponentSets = {} as ThemeComponentSets;

	for (const fileSet in fileSets) {
		const fileSetKey = fileSet as keyof typeof fileSets;
		const glob = fileSets[fileSetKey];

		themeComponentSets[fileSetKey] = await enrichThemes(glob, themeSet);
	}

	return themeComponentSets;
}
