import { json } from '@sveltejs/kit';
import {
	GET_PAGE_CONFIG_COOKIE_OPTIONS,
	PAGE_CONFIG_COOKIE_NAME
} from '$lib/collections/constants';
import {
	findReaderPageConfigInCookies,
	updateTagInReaderPageConfig
} from '$lib/features/page/utils';
import type { SectionReconfigRequest } from '$lib/features/section/types';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, params, locals, url }) => {
	const data: SectionReconfigRequest = await request.json();
	const { sectionId, tagId, checked } = data;

	const { username, pageslug } = params;
	const readerPageConfig = findReaderPageConfigInCookies(cookies);
	const updatedReaderPageConfig = updateTagInReaderPageConfig(
		readerPageConfig,
		sectionId,
		tagId,
		checked
	);

	const { sectionService } = locals;

	const result = await sectionService.getOne({
		sectionId,
		username,
		readerPageConfig: updatedReaderPageConfig
	});

	cookies.set(
		PAGE_CONFIG_COOKIE_NAME,
		JSON.stringify(updatedReaderPageConfig),
		GET_PAGE_CONFIG_COOKIE_OPTIONS(url.pathname)
	);

	return json(result);
};
