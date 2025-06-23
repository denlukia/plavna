import { enrichThemeSets } from '@plavna/design/theming/enricher';
import { getAppThemeGlob } from '$lib/styles/themes/glob';

import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	const { themeSet, ...other } = data;

	const themeComponentSets = await enrichThemeSets(themeSet, getAppThemeGlob());
	// console.log('themeComponentSets layout', themeComponentSets);

	return { themeComponentSets, themeSet, ...other };
}) satisfies LayoutLoad;
