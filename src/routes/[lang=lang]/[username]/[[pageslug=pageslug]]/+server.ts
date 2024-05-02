import { json } from '@sveltejs/kit';
import {
	findReaderPageConfigInCookies,
	setReaderPageConfigInCookies,
	updateTagInReaderPageConfig
} from '$lib/features/page/utils';
import type { SectionReconfigRequest } from '$lib/features/section/types';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, params, locals }) => {
	const data: SectionReconfigRequest = await request.json();
	const { sectionId, tagId, checked } = data;

	const { username, pageslug } = params;
	const readerPageConfig = findReaderPageConfigInCookies(cookies, username, pageslug);
	const updatedReaderPageConfig = updateTagInReaderPageConfig(
		readerPageConfig,
		sectionId,
		tagId,
		checked
	);
	setReaderPageConfigInCookies(cookies, username, pageslug, updatedReaderPageConfig);

	const { sectionService } = locals;

	const result = await sectionService.getOne({
		sectionId,
		username,
		readerPageConfig: updatedReaderPageConfig
	});

	return json(result);
};
