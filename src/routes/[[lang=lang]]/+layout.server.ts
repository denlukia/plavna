import { transGroups } from '$lib/server/i18n';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		translations: transGroups.layout(params.lang)
	};
}) satisfies LayoutServerLoad;
