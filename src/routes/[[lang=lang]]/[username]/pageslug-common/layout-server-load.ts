import type { LayoutServerLoad } from '../$types';

export const load = (async ({ locals, params }) => {
	const { pageService } = locals;

	const themeSet = await pageService.getThemeSet(params.username, params.pageslug || '');

	return {
		themeSet: themeSet
	};
}) satisfies LayoutServerLoad;
