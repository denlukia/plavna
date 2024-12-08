import { redirect } from '@sveltejs/kit';
import {
	GET_PAGE_CONFIG_COOKIE_OPTIONS,
	PAGE_CONFIG_COOKIE_NAME,
	SECTION_RECONFIG_QUERY_PARAM_NAME
} from '$lib/collections/config';
import type { SystemTranslationSliceKey } from '$lib/features/i18n/types';
import { getLang, getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import {
	getReaderPageConfigFromCookies,
	updateTagInReaderPageConfig
} from '$lib/features/page/utils';
import type { SectionRequest } from '$lib/features/section/types';

import type { PageServerLoad } from '../$types';

export const load = (async ({
	route,
	params,
	parent,
	locals: { pageService, actor, lang },
	cookies,
	url
}) => {
	const { username } = params;

	let pageslug = '';
	if ('pageslug' in params && typeof params.pageslug === 'string') {
		pageslug = params.pageslug;
	}

	// 1. Update reader page config if present in query
	let readerPageConfig = getReaderPageConfigFromCookies(cookies);

	const reconfigRequestString = url.searchParams.get(SECTION_RECONFIG_QUERY_PARAM_NAME);
	const reconfigRequest = reconfigRequestString
		? (JSON.parse(reconfigRequestString) as SectionRequest)
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

	const routeId = route.id;

	return {
		...page,
		lang,
		routeId,
		systemTranslations: {
			...systemTranslations,
			// TODO: only page if user isn't actor
			...getSystemTranslationsSlice(additionalTranslationsSlices, getLang(params.lang))
		}
	};
}) satisfies PageServerLoad;
