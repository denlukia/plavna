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

export function findReaderPageConfigInCookies(
	cookies: Cookies,
	username: string,
	pageslug: string | undefined
): ReaderPageConfig {
	const cookie = cookies.get(GET_PAGE_CONFIG_COOKIE_NAME(username, pageslug));
	return cookie ? JSON.parse(cookie) : {};
}

export function updateTagInReaderPageConfig(
	readerPageConfig: ReaderPageConfig,
	sectionId: SectionSelect['id'],
	tagId: TagSelect['id'],
	checked: boolean
) {
	let section = readerPageConfig[sectionId];

	if (checked) {
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

export function setReaderPageConfigInCookies(
	cookies: Cookies,
	username: string,
	pageslug: string | undefined,
	readerPageConfig: ReaderPageConfig
) {
	cookies.set(
		GET_PAGE_CONFIG_COOKIE_NAME(username, pageslug),
		JSON.stringify(readerPageConfig),
		GET_PAGE_CONFIG_COOKIE_OPTIONS('.')
	);
}
