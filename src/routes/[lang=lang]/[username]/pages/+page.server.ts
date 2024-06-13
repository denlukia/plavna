import { fail } from '@sveltejs/kit';
import { setError, superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { checkTranslationKey, getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import {
	pageCreationFormSchema,
	pageUpdatingFormSchema,
	type PageCreationForm
} from '$lib/features/page/parsers';

export const load = async ({ locals: { pageService }, params, parent }) => {
	const forms = await pageService.getMyAsForms(params.username);
	const { systemTranslations } = await parent();

	return {
		...forms,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('pages_list', params.lang)
		}
	};
};

function failWithSlugError(form: SuperValidated<PageCreationForm>) {
	const { slug } = form.data;

	setError(
		form,
		'slug',
		checkTranslationKey(
			slug ? 'pages_list.errors.slug_in_use' : 'pages_list.errors.only_one_default_slug'
		)
	);
	fail(400, { form });
}

export const actions = {
	create: async ({ locals: { pageService }, request }) => {
		const form = await superValidate(request, zod(pageCreationFormSchema));
		if (!form.valid) fail(400, { form });

		try {
			await pageService.create(form.data);
		} catch {
			return failWithSlugError(form);
		}

		return { form };
	},
	update: async ({ locals: { pageService }, request }) => {
		const form = await superValidate(request, zod(pageUpdatingFormSchema));

		if (!form.valid) fail(400, { form });

		try {
			await pageService.update(form.data);
		} catch {
			return failWithSlugError(form);
		}

		return { form };
	},
	delete: async ({ locals: { pageService }, request }) => {
		const form = await superValidate(request, zod(pageUpdatingFormSchema));
		if (!form.valid) fail(400, { form });

		try {
			await pageService.delete(form.data.id);
		} catch (e) {
			fail(400, { form });
		}

		return { form };
	}
};
