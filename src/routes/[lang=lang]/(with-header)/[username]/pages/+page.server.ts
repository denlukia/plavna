import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	checkTranslationKey,
	getSystemTranslationsSlice
} from '$lib/(features)/common/translations/_index';
import {
	pageCreateFormSchema,
	pageUpdateFormSchema
} from '$lib/(features)/user_pages_list/parsers';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { plavna }, params, parent }) => {
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

export const actions = {
	create: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageCreateFormSchema));
		if (!form.valid) return fail(400, { form });

		try {
			await plavna.pages.create(form.data);
		} catch {
			const slug = form.data.slug;
			setError(
				form,
				'slug',
				checkTranslationKey(
					slug ? 'user_pages.errors.slug_in_use' : 'user_pages.errors.only_one_default_slug'
				)
			);
		}

		return { form };
	},
	update: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageUpdateFormSchema));
		console.log(form);
		if (!form.valid) return fail(400, { form });

		await plavna.pages.update(form.data);

		return { form };
	},
	delete: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageUpdateFormSchema));
		if (!form.valid) return fail(400, { form });

		await plavna.pages.delete(form.data.id);

		return { form };
	}
};
