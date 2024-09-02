import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	sectionDeleteSchema,
	sectionInsertSchema,
	sectionUpdateSchema
} from '$lib/features/section/parsers';

import type { Actions } from '../$types';

export const actions = {
	create_section: async ({ request, params, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionInsertSchema));
		if (!form.valid) fail(400, { form });

		let pageslug = '';
		if ('pageslug' in params && typeof params.pageslug === 'string') {
			pageslug = params.pageslug;
		}

		await sectionService.create(pageslug, form.data);

		return { form };
	},
	update_section: async ({ request, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionUpdateSchema));
		if (!form.valid) fail(400, { form });

		await sectionService.update(form.data);

		return { form };
	},
	delete_section: async ({ request, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionDeleteSchema));
		if (!form.valid) fail(400, { form });

		await sectionService.delete(form.data);

		return { form };
	}
} satisfies Actions;
