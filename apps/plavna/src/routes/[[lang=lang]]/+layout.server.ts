import { defaultThemeSet } from '@plavna/design/theming';
import { selectProvider } from '@plavna/image-uploader/images';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { SystemTranslationSliceKey } from '$lib/i18n/types.js';
import { getLang, getSystemTranslationsSlice } from '$lib/i18n/utils.js';
import { imageProviderUpdateFormSchema } from '$lib/image/validators';
import { enrichLogo } from '$lib/layout/enricher.js';
import { getSafeUserData } from '$lib/user/utils.js';

export const load = async ({ params, locals }) => {
	const { actor, lang } = locals;
	const user = await getSafeUserData(params.username);

	const requiredSlices: SystemTranslationSliceKey[] = ['layout'];
	let hasValidCredentialsSet = false;
	if (actor) {
		const selectedProvider = selectProvider(actor);
		if (selectedProvider) {
			hasValidCredentialsSet = true;
		}
		requiredSlices.push('actor_errors');
	}

	const logoTextSvg = await enrichLogo(lang);

	return {
		actor,
		user,
		logoTextSvg,
		themeSet: defaultThemeSet,
		imageProvider: {
			hasValidCredentialsSet,
			superValidated: await superValidate(actor, zod(imageProviderUpdateFormSchema))
		},
		systemTranslations: getSystemTranslationsSlice(requiredSlices, getLang(params.lang))
	};
};
