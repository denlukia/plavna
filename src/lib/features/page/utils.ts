import { error, type Cookies } from '@sveltejs/kit';
import { PAGE_CONFIG_COOKIE_NAME, PAGE_SLUG_PREFIX } from '$lib/collections/constants';

import type { SectionSelect } from '../section/parsers';
import type { SectionReconfigRequest } from '../section/types';
import type { TagSelect } from '../tag/parsers';
import type { ReaderPageConfig } from './parsers';

export function findExcludedTagsInReaderPageConfig(
	readerPageConfig: ReaderPageConfig | null,
	sectionId: SectionSelect['id']
): Array<TagSelect['id']> {
	return readerPageConfig?.[sectionId]?.excludedTags || [];
}

export function getReaderPageConfigFromCookies(cookies: Cookies): ReaderPageConfig | null {
	const cookie = cookies.get(PAGE_CONFIG_COOKIE_NAME);
	const parsed = cookie ? JSON.parse(cookie) : null;
	if (typeof parsed === 'object') {
		return parsed;
	} else {
		return null;
	}
}

export function updateTagInReaderPageConfig(
	readerPageConfig: ReaderPageConfig | null,
	{ sectionId, tagId, newChecked }: SectionReconfigRequest
) {
	let section = { excludedTags: [] as Array<TagSelect['id']> };
	if (readerPageConfig && sectionId in readerPageConfig) {
		section = readerPageConfig[sectionId];
	} else {
		readerPageConfig = { ...readerPageConfig, [sectionId]: section };
	}

	if (newChecked) {
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
