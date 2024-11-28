import type { Component } from 'svelte';

import type { ThemeComponentSets, ThemeSet } from './themes';

export async function enrichThemeSets(themeSet: ThemeSet | null) {
	if (!themeSet) {
		return null;
	}

	const designSystemFilesGlob = import.meta.glob('$lib/design/themes/*/*/Index.svelte');
	const appFilesGlob = import.meta.glob('$lib/features/themes/*/*/Index.svelte');

	const fileSets = { designSystem: designSystemFilesGlob, app: appFilesGlob };
	const categories = ['color', 'style', 'typography'] as const;

	const themeComponentSets = {} as ThemeComponentSets;

	for (const fileSet in fileSets) {
		const fileSetKey = fileSet as keyof typeof fileSets;
		const glob = fileSets[fileSetKey];

		themeComponentSets[fileSetKey] = {} as ThemeComponentSets[typeof fileSetKey];

		for (const category of categories) {
			const foundEntry = Object.entries(glob).find(([path]) =>
				path.includes(`themes/${category}/${themeSet[category]}/Index.svelte`)
			);

			const errorText = `${category} theme not found`;

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
				themeComponentSets[fileSetKey][category] = themeModule.default as Component;
			} else {
				throw new Error(errorText);
			}
		}
	}

	return themeComponentSets;
}
