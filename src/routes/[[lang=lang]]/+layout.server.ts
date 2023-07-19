import { transGroups } from '$lib/server/i18n';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const session = await locals.authRequest.validate();
	return {
		user: session?.user,
		translations: transGroups.layout(params.lang)
	};
}) satisfies LayoutServerLoad;
