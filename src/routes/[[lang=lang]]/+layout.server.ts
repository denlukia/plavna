import { selectProvider } from '@denlukia/plavna-common/images';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getSafeUserData } from '$lib/features/auth/utils.js';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils.js';
import { imageProviderUpdateFormSchema } from '$lib/features/image/parsers';

export const load = async ({ params, locals }) => {
	const { actor } = locals;
	const user = await getSafeUserData(params.username);

	let hasValidCredentialsSet = false;
	if (actor) {
		const selectedProvider = selectProvider(actor);
		if (selectedProvider) {
			hasValidCredentialsSet = true;
		}
	}

	return {
		actor,
		user,
		imageProvider: {
			hasValidCredentialsSet,
			superValidated: await superValidate(actor, zod(imageProviderUpdateFormSchema))
		},
		systemTranslations: getSystemTranslationsSlice('layout', getLang(params.lang))
	};
};
