import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	GET_PAGE_CONFIG_COOKIE_OPTIONS,
	PAGE_CONFIG_COOKIE_NAME,
	SECTION_RECONFIG_QUERY_PARAM_NAME
} from '$lib/collections/constants';
import type { SystemTranslationSliceKey } from '$lib/features/i18n/types.js';
import { getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import {
	getReaderPageConfigFromCookies,
	getUnprefixedPageSlug,
	updateTagInReaderPageConfig
} from '$lib/features/page/utils';
import {
	sectionDeleteSchema,
	sectionInsertSchema,
	sectionUpdateSchema
} from '$lib/features/section/parsers';
import type { SectionReconfigRequest } from '$lib/features/section/types';

export const load = async ({ params, parent, locals: { pageService, actor }, cookies, url }) => {
	const { username } = params;

	const pageslug = getUnprefixedPageSlug(params.prefixedpageslug);

	// 1. Update reader page config if present in query
	let readerPageConfig = getReaderPageConfigFromCookies(cookies);

	const reconfigRequestString = url.searchParams.get(SECTION_RECONFIG_QUERY_PARAM_NAME);
	const reconfigRequest = reconfigRequestString
		? (JSON.parse(reconfigRequestString) as SectionReconfigRequest)
		: undefined;

	// If we had reader page config – set new cookie and redirect
	if (reconfigRequest) {
		readerPageConfig = updateTagInReaderPageConfig(readerPageConfig, reconfigRequest);
		cookies.set(
			PAGE_CONFIG_COOKIE_NAME,
			JSON.stringify(readerPageConfig),
			GET_PAGE_CONFIG_COOKIE_OPTIONS(url.pathname)
		);

		redirect(302, url.pathname);
	}

	// 2. Get main data
	const page = await pageService.getOneWithSectionsAndArticles(
		username,
		pageslug,
		readerPageConfig
	);

	// 3. Add system translations
	const { systemTranslations } = await parent();
	const additionalTranslationsSlices: SystemTranslationSliceKey[] = actor
		? ['page', 'page_actor']
		: ['page'];

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
		if (!form.valid) fail(400, { form });

		const pageslug = getUnprefixedPageSlug(params.prefixedpageslug);

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
};
