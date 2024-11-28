import type { LayoutServerLoad } from '../$types';

export const load = (async () => {
	return {
		themeSet: { color: 'milk', style: 'modern', typography: 'inter' }
	};
}) satisfies LayoutServerLoad;
