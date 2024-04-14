import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { translationInsertSchema } from '$lib/features/i18n/parsers';
import { sectionDeleteSchema, sectionUpdateSchema } from '$lib/features/section/parsers';

export const load = async ({ params, locals: { pageService } }) => {
	const { username } = params;

	let pageslug = '';
	const prefix = 'page-';
	const hasPrefix = params.pageslug?.startsWith(prefix);

	if (hasPrefix) {
		pageslug = params.pageslug?.slice(prefix.length) || '';
		if (!pageslug) return error(404);
	}
	return pageService.getOneWithSectionsAndArticles(username, pageslug);
};

export const actions = {
	create_section: async ({ request, params, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(translationInsertSchema));
		if (!form.valid) return fail(400, { form });

		const pageslug = params.pageslug ?? '';

		await sectionService.create(pageslug, form.data);
	},
	update_section: async ({ request, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionUpdateSchema));
		if (!form.valid) return fail(400, { form });

		await sectionService.update(form.data);
	},
	delete_section: async ({ request, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionDeleteSchema));
		if (!form.valid) return fail(400, { form });

		await sectionService.delete(form.data);
	}
};
