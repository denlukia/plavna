import { getSystemTranslationsSlice } from '$lib/(features)/common/translations/_index.js';

export const load = async ({ params, locals }) => {
	const { user } = locals;
	return {
		user,
		systemTranslations: getSystemTranslationsSlice('layout', params.lang)
	};
};
