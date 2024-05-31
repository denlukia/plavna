import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import { findReaderPageConfigInCookies } from '$lib/features/page/utils';
import {
	sectionDeleteSchema,
	sectionInsertSchema,
	sectionUpdateSchema
} from '$lib/features/section/parsers';
import { get } from 'http';
import type { SystemTranslationSliceKey } from '$lib/features/i18n/types.js';

export const load = async ({ params, parent, locals: { pageService,actor }, cookies }) => {
	const { username } = params;

	function getUnprefixedPageSlug(prefixed: string | undefined) {
		let pageslug = '';
		if (!prefixed) return pageslug;

		const prefix = 'page-';
		const hasPrefix = prefixed.startsWith(prefix);

		if (hasPrefix) {
			pageslug = prefixed.slice(prefix.length) || '';
			if (!pageslug) {
				error(404);
			}
		}

		return pageslug;
	}

	const pageslug = getUnprefixedPageSlug(params.pageslug);

	const readerPageConfig = findReaderPageConfigInCookies(cookies);

	const page = await pageService.getOneWithSectionsAndArticles(
		username,
		pageslug,
		readerPageConfig
	);
	const { systemTranslations } = await parent();

	const additionalTranslationsSlices: SystemTranslationSliceKey[] = actor ? ['page', 'page_actor'] : ['page'];

	return {
		...page,
		systemTranslations: {
			...systemTranslations,
			// TODO: only page if user isn't actor
			...getSystemTranslationsSlice(additionalTranslationsSlices, params.lang)
		}
	};
};

export const actions = {
	create_section: async ({ request, params, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionInsertSchema));
		if (!form.valid) return fail(400, { form });

		const pageslug = params.pageslug ?? '';

		await sectionService.create(pageslug, form.data);

		return { form };
	},
	update_section: async ({ request, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionUpdateSchema));
		if (!form.valid) return fail(400, { form });

		await sectionService.update(form.data);

		return { form };
	},
	delete_section: async ({ request, locals: { sectionService } }) => {
		const form = await superValidate(request, zod(sectionDeleteSchema));
		if (!form.valid) return fail(400, { form });

		await sectionService.delete(form.data);

		return { form };
	}
};
