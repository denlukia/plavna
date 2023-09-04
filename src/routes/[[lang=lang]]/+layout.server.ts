import { defaultLang } from '$lib/isomorphic/languages';
import { serviceTranslations } from '$lib/server/i18n';

export const load = async ({ params, locals }) => {
	const session = await locals.authRequest.validate();
	return {
		user: session?.user ?? null,
		translations: serviceTranslations.layout(params.lang ?? defaultLang)
	};
};
