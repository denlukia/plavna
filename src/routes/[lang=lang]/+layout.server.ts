import { getSystemTranslationsSlice } from '$lib/features/i18n/utils.js';
import { getSafeUserData } from '$lib/features/user/utils.js';

export const load = async ({ params, locals }) => {
	const { actor } = locals;
	const user = await getSafeUserData(params.username);
	return {
		actor,
		user,
		systemTranslations: getSystemTranslationsSlice('layout', params.lang)
	};
};
