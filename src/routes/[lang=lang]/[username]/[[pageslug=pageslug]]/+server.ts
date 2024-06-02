import { json } from '@sveltejs/kit';
import {
	GET_PAGE_CONFIG_COOKIE_OPTIONS,
	PAGE_CONFIG_COOKIE_NAME
} from '$lib/collections/constants';
import {
	getReaderPageConfigFromCookies,
	updateTagInReaderPageConfig
} from '$lib/features/page/utils';
import type { SectionReconfigRequest } from '$lib/features/section/types';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, params, locals, url }) => {
	const reconfigRequest: SectionReconfigRequest = await request.json();
	const { sectionId } = reconfigRequest;

	const { username } = params;
	let readerPageConfig = getReaderPageConfigFromCookies(cookies);
	readerPageConfig = updateTagInReaderPageConfig(readerPageConfig, reconfigRequest);

	const { sectionService } = locals;

	const result = await sectionService.getOne({
		sectionId,
		username,
		readerPageConfig
	});

	cookies.set(
		PAGE_CONFIG_COOKIE_NAME,
		JSON.stringify(readerPageConfig),
		GET_PAGE_CONFIG_COOKIE_OPTIONS(url.pathname)
	);

	return json(result);
};
