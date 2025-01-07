import { defaultThemeSet } from '@plavna/design/themes/themes';
import { selectProvider } from '@plavna/image-uploader/images';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { SystemTranslationSliceKey } from '$lib/features/i18n/types.js';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils.js';
import { imageProviderUpdateFormSchema } from '$lib/features/image/validators';
import { enrichLogo } from '$lib/features/layout/enricher.js';
import { getSafeUserData } from '$lib/features/user/utils.js';

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
