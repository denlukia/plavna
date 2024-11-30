import { selectProvider } from '@denlukia/plavna-common/images';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { defaultThemeSet, type ThemeSet } from '$lib/design/themes/themes';
import type { SystemTranslationSliceKey } from '$lib/features/i18n/types.js';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils.js';
import { imageProviderUpdateFormSchema } from '$lib/features/image/validators';
import { getSafeUserData } from '$lib/features/user/utils.js';

export const load = async ({ params, locals, route }) => {
	const { actor } = locals;
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

	let themeSet: ThemeSet | null = null;
	if (
		route.id !== '/[[lang=lang]]/[username]' &&
		!route.id.startsWith('/[[lang=lang]]/[username]/[articleslug]') &&
		!route.id.startsWith('/[[lang=lang]]/[username]/p:[pageslug]')
	) {
		themeSet = defaultThemeSet;
	}

	return {
		actor,
		user,
		themeSet,
		imageProvider: {
			hasValidCredentialsSet,
			superValidated: await superValidate(actor, zod(imageProviderUpdateFormSchema))
		},
		systemTranslations: getSystemTranslationsSlice(requiredSlices, getLang(params.lang))
	};
};
