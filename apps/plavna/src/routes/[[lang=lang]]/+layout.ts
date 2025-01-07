import { enrichThemeSets } from '$lib/features/themes/enricher';

import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	const { themeSet, ...other } = data;

	const themeComponentSets = await enrichThemeSets(themeSet);

	return { themeComponentSets, ...other };
}) satisfies LayoutLoad;
