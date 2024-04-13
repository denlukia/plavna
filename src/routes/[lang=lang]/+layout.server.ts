import { getSystemTranslationsSlice } from '$lib/features/i18n/utils.js';

export const load = async ({ params, locals }) => {
	const { user } = locals;
	return {
		user,
		systemTranslations: getSystemTranslationsSlice('layout', params.lang)
	};
};
