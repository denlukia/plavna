import type { Cookies } from '@sveltejs/kit';
import {
	GET_PAGE_CONFIG_COOKIE_NAME,
	GET_PAGE_CONFIG_COOKIE_OPTIONS
} from '$lib/collections/constants';

import type { SectionSelect } from '../section/parsers';
import type { TagSelect } from '../tag/parsers';
import type { ReaderPageConfig } from './parsers';

export function findExcludedTagsInReaderPageConfig(
	readerPageConfig: ReaderPageConfig,
	sectionId: SectionSelect['id']
): Array<TagSelect['id']> {
	return readerPageConfig[sectionId]?.excludedTags || [];
}

export function findPageConfigInCookies(
	cookies: Cookies,
	username: string,
	pageslug: string
): ReaderPageConfig {
	const cookie = cookies.get(GET_PAGE_CONFIG_COOKIE_NAME(username, pageslug));
	return cookie ? JSON.parse(cookie) : {};
}

export function updateTagInPageConfig(
	readerPageConfig: ReaderPageConfig,
	sectionId: SectionSelect['id'],
	tagId: TagSelect['id'],
	newState: 'included' | 'excluded'
) {
	let section = readerPageConfig[sectionId];

	if (newState === 'included') {
		section = {
			...section,
			excludedTags: section.excludedTags.filter((tag) => tag !== tagId)
		};
	} else {
		section = {
			...section,
			excludedTags: [...section.excludedTags, tagId]
		};
	}

	readerPageConfig[sectionId] = section;
	return readerPageConfig;
}

export function setPageConfigInCookies(
	cookies: Cookies,
	username: string,
	pageslug: string,
	readerPageConfig: ReaderPageConfig
) {
	cookies.set(
		GET_PAGE_CONFIG_COOKIE_NAME(username, pageslug),
		JSON.stringify(readerPageConfig),
		GET_PAGE_CONFIG_COOKIE_OPTIONS('.')
	);
}
