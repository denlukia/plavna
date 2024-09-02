import { ServerImageHandler } from '@denlukia/plavna-common/image-handler';
import type { Config } from '@sveltejs/adapter-vercel';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { IMAGE_CREDENTIALS_PATH } from '$lib/collections/constants';
import { getSystemTranslationsSlice } from '$lib/features/i18n/utils.js';
import { imageProviderUpdateFormSchema } from '$lib/features/image/parsers';
import { getSafeUserData } from '$lib/features/user/utils.js';

export const config: Config = { runtime: 'edge', regions: ['fra1'] };

export const load = async ({ params, locals }) => {
	const { actor } = locals;
	const user = await getSafeUserData(params.username);

	let hasValidCredentialsSet = false;
	if (actor) {
		try {
			const imageHandler = new ServerImageHandler();
			await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);
			hasValidCredentialsSet = true;
		} catch (e) {
			console.log(e);
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
