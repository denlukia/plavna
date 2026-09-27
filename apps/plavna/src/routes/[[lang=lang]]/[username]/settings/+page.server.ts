import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { generatePath } from '$lib/common/links';
import { checkTranslationKey, getLang, getSystemTranslationsSlice } from '$lib/i18n/utils';
import { imageProviderUpdateFormSchema } from '$lib/image/validators';
import { githubConnectionFormSchema, userSettingsFormSchema } from '$lib/user/validators';

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
	const githubSuperValidated = await actorService.getGithubConnectionForm(params.username);
	const imageProviderSuperValidated = await actorService.getImageProviderForm(params.username);

	const closedGreetings = Boolean(cookies.get(CLOSED_GREETINGS_COOKIE_NAME));

	const routeId = route.id;

	return {
		routeId,
		lang,
		superValidated,
		githubSuperValidated,
		imageProviderSuperValidated,
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
	update_github: async ({ request, locals: { actorService } }) => {
		const form = await superValidate(request, zod(githubConnectionFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await actorService.updateGithubConnection(form.data);

		return { form };
	},
	update_image_provider: async ({ request, locals: { actorService } }) => {
		const form = await superValidate(request, zod(imageProviderUpdateFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await actorService.updateImageProvider(form.data);
		} catch {
			return setError(form, '', checkTranslationKey('actor_errors.invalid_image_provider'));
		}
		return { form };
	},
	delete_image_provider: async ({ locals: { actorService } }) => {
		const form = await superValidate(zod(imageProviderUpdateFormSchema));

		await actorService.deleteImageProvider();

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
