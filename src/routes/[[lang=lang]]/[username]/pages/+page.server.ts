import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { pageCreateFormSchema, pageUpdateFormSchema } from '$lib/server/domain/zod';
import { transGroups } from '$lib/server/i18n';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { plavna }, params, parent }) => {
	const forms = await plavna.pages.getMyAsForms(params.username);
	const { translations } = await parent();

	return {
		...forms,
		translations: { ...translations, ...transGroups.userPages(params.lang) }
	};
};

export const actions = {
	create: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, pageCreateFormSchema);
		if (!form.valid) return fail(400, { form });

		await plavna.pages.create(form.data);
	},
	update: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, pageUpdateFormSchema);
		if (!form.valid) return fail(400, { form });

		await plavna.pages.update(form.data);
	},
	delete: async ({ locals: { plavna }, request }) => {
		const form = await superValidate(request, pageUpdateFormSchema);
		if (!form.valid) return fail(400, { form });

		await plavna.pages.delete(form.data.id);
	}
};
