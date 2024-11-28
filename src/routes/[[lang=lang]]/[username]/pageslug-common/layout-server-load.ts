import { defaultThemeSet } from '$lib/features/themes/themes';

import type { LayoutServerLoad } from '../$types';

export const load = (async () => {
	return {
		themeSet: defaultThemeSet
	};
}) satisfies LayoutServerLoad;
