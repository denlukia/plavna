import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import {
	sectionDeleteSchema,
	sectionInsertSchema,
	sectionUpdateSchema
} from '$lib/features/section/parsers';

export const load = async ({ params, parent, locals: { pageService } }) => {
	const { username } = params;

	let pageslug = '';
	const prefix = 'page-';
	const hasPrefix = params.pageslug?.startsWith(prefix);

	if (hasPrefix) {
		pageslug = params.pageslug?.slice(prefix.length) || '';
		if (!pageslug) return error(404);
	}
	const page = await pageService.getOneWithSectionsAndArticles(username, pageslug);
	const { systemTranslations } = await parent();

	return {
		...page,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('page', params.lang)
		}
	};
};

export const actions = {
	create_section: async ({ request, params, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionInsertSchema));
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
