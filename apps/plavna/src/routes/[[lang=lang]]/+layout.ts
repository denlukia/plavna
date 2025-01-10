import { enrichThemeSets } from '@plavna/design/theming';
import { getThemeStylesGlob } from '$lib/styles/themes/glob';

import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	const { themeSet, ...other } = data;

	const themeComponentSets = await enrichThemeSets(themeSet, getThemeStylesGlob());

	return { themeComponentSets, themeSet, ...other };
}) satisfies LayoutLoad;
