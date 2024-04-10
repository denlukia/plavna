import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	sectionDeleteSchema,
	sectionUpdateSchema,
	translationInsertSchema
} from '$lib/server/collections/parsers';

export const load = async ({ params, locals: { plavna } }) => {
	const { username } = params;

	let pageslug = '';
	if ('pageslug' in params && params.pageslug) {
		const prefix = 'page-';
		const unprefixed = params.pageslug.slice(prefix.length);
		pageslug = unprefixed;
	}
	const result = await plavna.pages.getOneWithSectionsAndArticles(username, pageslug);

	return { ...result, recordsTranslations: result.translations };
};

export const actions = {
	create_section: async ({ request, params, locals: { plavna } }) => {
		const form = await superValidate(request, zod(translationInsertSchema));
		if (!form.valid) return fail(400, { form });

		const pageslug = params.pageslug ?? '';

		await plavna.sections.create(pageslug, form.data);
	},
	update_section: async ({ request, locals: { plavna } }) => {
		const form = await superValidate(request, zod(sectionUpdateSchema));
		if (!form.valid) return fail(400, { form });

		await plavna.sections.update(form.data);
	},
	delete_section: async ({ request, locals: { plavna } }) => {
		const form = await superValidate(request, zod(sectionDeleteSchema));
		if (!form.valid) return fail(400, { form });

		await plavna.sections.delete(form.data);
	}
};
