import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { generatePath } from '$lib/features/common/links';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import { userSettingsFormSchema } from '$lib/features/user/parsers';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent, route, locals }) => {
	const { systemTranslations } = await parent();

	const superValidated = await locals.actorService.getSettingsForm(params.username);

	const routeId = route.id;

	return {
		routeId,
		superValidated,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('settings', getLang(params.lang))
		}
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals: { actorService } }) => {
		const form = await superValidate(request, zod(userSettingsFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const newSettings = await actorService.updateSettings(form.data);

		if (newSettings.username !== params.username) {
			const newPath = generatePath('/[lang]/[username]/settings', params, {
				username: newSettings.username
			});
			return redirect(303, newPath);
		}

		return { form };
	}
};
