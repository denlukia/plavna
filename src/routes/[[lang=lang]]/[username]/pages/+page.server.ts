import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getActionFailure } from '$lib/features/error/fail-with-form-error';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import { pageCreationFormSchema, pageUpdatingFormSchema } from '$lib/features/page/validators';

export const load = async ({ locals: { pageService, lang }, params, parent, route }) => {
	const forms = await pageService.getMyAsForms(params.username);
	const { systemTranslations } = await parent();

	const routeId = route.id;

	return {
		...forms,
		lang,
		routeId,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('pages_list', getLang(params.lang))
		}
	};
};

export const actions = {
	create: async ({ locals: { pageService }, request }) => {
		const form = await superValidate(request, zod(pageCreationFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pageService.create(form.data);
		} catch (e) {
			return getActionFailure(e, form, 'slug');
		}

		return { form };
	},
	update: async ({ locals: { pageService }, request }) => {
		const form = await superValidate(request, zod(pageUpdatingFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pageService.update(form.data);
		} catch (e) {
			return getActionFailure(e, form, 'slug');
		}

		return { form };
	},
	delete: async ({ locals: { pageService }, request }) => {
		const form = await superValidate(request, zod(pageUpdatingFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await pageService.delete(form.data.id);
		} catch (e) {
			return fail(400, { form });
		}

		return { form };
	}
};
