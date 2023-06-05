import type { PossiblyUser } from '$lib/server/auth';
import { transGroups } from '$lib/server/i18n';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, locals }) => {
	const { user }: { user: PossiblyUser } = await locals.auth.validateUser();
	return {
		user,
		translations: transGroups.layout(params.lang)
	};
}) satisfies LayoutServerLoad;
