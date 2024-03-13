import { serviceTranslations } from '$lib/server/i18n';

export const load = async ({ params, locals }) => {
	const { user } = locals;
	return {
		user,
		translations: serviceTranslations.layout(params.lang)
	};
};
