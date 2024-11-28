import { enrichThemeSets } from '$lib/features/themes/enricher';

import type { LayoutLoad } from '../$types';

export const load = (async ({ data }) => {
	const { themeSet } = data;

	const themeComponentSets = await enrichThemeSets(themeSet);

	return { themeComponentSets };
}) satisfies LayoutLoad;
