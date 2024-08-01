import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getSystemTranslationsSlice } from '$lib/features/i18n/utils.js';
import { imageProviderUpdateFormSchema } from '$lib/features/image/parsers';
import { getSafeUserData } from '$lib/features/user/utils.js';

export const load = async ({ params, locals }) => {
	const { actor } = locals;
	const user = await getSafeUserData(params.username);

	let hasValidCredentialsSet = false;
	if (actor) {
		try {
			await new ServerImageHandler().setProviderAndUploader(actor);
			hasValidCredentialsSet = true;
		} catch {
			/**/
		}
	}

	return {
		actor,
		user,
		imageProvider: {
			hasValidCredentialsSet,
			superValidated: await superValidate(actor, zod(imageProviderUpdateFormSchema))
		},
		systemTranslations: getSystemTranslationsSlice('layout', params.lang)
	};
};
