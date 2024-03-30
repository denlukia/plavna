import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { pageCreateFormSchema, pageUpdateFormSchema } from '$lib/server/collections/parsers';
import { serviceTranslations } from '$lib/server/i18n';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { plavna }, params, parent }) => {
	const forms = await plavna.pages.getMyAsForms(params.username);
	const { translations } = await parent();

	return {
		...forms,
		translations: { ...translations, ...serviceTranslations.userPages(params.lang) }
	};
};

export const actions = {
	create: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageCreateFormSchema));
		if (!form.valid) return fail(400, { form });

		await plavna.pages.create(form.data);
	},
	update: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageUpdateFormSchema));
		if (!form.valid) return fail(400, { form });

		await plavna.pages.update(form.data);
	},
	delete: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, zod(pageUpdateFormSchema));
		if (!form.valid) return fail(400, { form });

		await plavna.pages.delete(form.data.id);
	}
};
