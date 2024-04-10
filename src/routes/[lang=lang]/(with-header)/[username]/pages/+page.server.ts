import { fail } from '@sveltejs/kit';
import { setError, superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	checkTranslationKey,
	getSystemTranslationsSlice
} from '$lib/(features)/common/translations/_index';
import {
	pageCreationFormSchema,
	pageUpdatingFormSchema,
	type PageCreationForm
} from '$lib/(features)/pages-list/parsers';

export const load = async ({ locals: { plavna }, params, parent }) => {
	const forms = await plavna.pages.getMyAsForms(params.username);
	const { systemTranslations } = await parent();

	return {
		...forms,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('user_pages', params.lang)
		}
	};
};

function failWithSlugError(form: SuperValidated<PageCreationForm>) {
	const { slug } = form.data;

	setError(
		form,
		'slug',
		checkTranslationKey(
			slug ? 'user_pages.errors.slug_in_use' : 'user_pages.errors.only_one_default_slug'
		)
	);
	return fail(400, { form });
}

export const actions = {
	create: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageCreationFormSchema));
		if (!form.valid) return fail(400, { form });

		try {
			await plavna.pages.create(form.data);
		} catch {
			return failWithSlugError(form);
		}

		return { form };
	},
	update: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageUpdatingFormSchema));

		if (!form.valid) return fail(400, { form });

		try {
			await plavna.pages.update(form.data);
		} catch {
			return failWithSlugError(form);
		}

		return { form };
	},
	delete: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageUpdatingFormSchema));
		if (!form.valid) return fail(400, { form });

		try {
			await plavna.pages.delete(form.data.id);
		} catch (e) {
			return fail(400, { form });
		}

		return { form };
	}
};
