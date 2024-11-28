import { enrichThemeSet } from '$lib/features/themes/enricher';

import type { LayoutLoad } from '../$types';

export const load = (async ({ data }) => {
	const { themeSet } = data;

	const themeComponentSet = await enrichThemeSet(themeSet);

	return { themeComponentSet };
}) satisfies LayoutLoad;
