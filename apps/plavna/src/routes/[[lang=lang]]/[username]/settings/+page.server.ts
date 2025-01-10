import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { generatePath } from '$lib/common/links';
import { getLang, getSystemTranslationsSlice } from '$lib/i18n/utils';
import { userSettingsFormSchema } from '$lib/user/validators';

import type { Actions, PageServerLoad } from './$types';
import { CLOSED_GREETINGS_COOKIE_NAME } from './config';

export const load: PageServerLoad = async ({
	params,
	parent,
	route,
	locals: { actorService, lang },
	cookies
}) => {
	const { systemTranslations } = await parent();

	const superValidated = await actorService.getSettingsForm(params.username);

	const closedGreetings = Boolean(cookies.get(CLOSED_GREETINGS_COOKIE_NAME));

	const routeId = route.id;

	return {
		routeId,
		lang,
		superValidated,
		closedGreetings,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('settings', getLang(params.lang))
		}
	};
};

export const actions: Actions = {
	update_settings: async ({ request, params, locals: { actorService } }) => {
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
	},
	close_greetings: async ({ cookies }) => {
		cookies.set(CLOSED_GREETINGS_COOKIE_NAME, 'true', {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax'
		});

		return;
	}
};
