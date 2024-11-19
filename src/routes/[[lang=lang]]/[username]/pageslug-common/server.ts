import { text } from '@sveltejs/kit';
import { stringify } from 'devalue';
import { GET_PAGE_CONFIG_COOKIE_OPTIONS, PAGE_CONFIG_COOKIE_NAME } from '$lib/collections/config';
import {
	getReaderPageConfigFromCookies,
	updateTagInReaderPageConfig
} from '$lib/features/page/utils';
import type { SectionRequest } from '$lib/features/section/types';

import type { RequestHandler } from '../$types';

export const POST = (async ({ request, cookies, params, locals, url }) => {
	const sectionRequest: SectionRequest = await request.json();
	const { sectionId } = sectionRequest;

	const { username } = params;
	let readerPageConfig = getReaderPageConfigFromCookies(cookies);

	if ('tagId' in sectionRequest) {
		readerPageConfig = updateTagInReaderPageConfig(readerPageConfig, {
			sectionId,
			tagId: sectionRequest.tagId,
			newChecked: sectionRequest.newChecked
		});
	}

	let articlesOffset = 0;
	if ('offset' in sectionRequest) {
		articlesOffset = sectionRequest.offset;
	}

	const { sectionService } = locals;
	const result = await sectionService.getOne({
		sectionId,
		username,
		readerPageConfig,
		articlesOffset
	});

	cookies.set(
		PAGE_CONFIG_COOKIE_NAME,
		JSON.stringify(readerPageConfig),
		GET_PAGE_CONFIG_COOKIE_OPTIONS(url.pathname)
	);

	return text(stringify(result));
}) satisfies RequestHandler;
