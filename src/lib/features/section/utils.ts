import { supportedLangs } from '@denlukia/plavna-common/constants';
import { marked, type TokensList } from 'marked';

import type { TagSelect } from '../tag/parsers';
import type { SectionInsert } from './parsers';
import type { TagIdWithLang } from './types';

export function findTagIdsInLinks(tokens: TokensList) {
	const tags: TagSelect['id'][] = [];
	function parseTokensArray(tokens: TokensList) {
		tokens.forEach((token) => {
			if (token.type === 'link' && token.href.startsWith('tag:')) {
				tags.push(Number(token.href.split('tag:')[1]));
			}
			// @ts-ignore
			if (token.tokens) {
				// @ts-ignore
				parseTokensArray(token.tokens);
			}
		});
	}
	parseTokensArray(tokens);
	return tags;
}

export function findTagsInText(text: string | undefined | null) {
	if (!text) return [];
	return findTagIdsInLinks(marked.lexer(text));
}

export function findTagsInSectionTranslations(translations: SectionInsert): TagIdWithLang[] {
	const tags = [] as TagIdWithLang[];
	supportedLangs.forEach((lang) => {
		const translationText = translations[lang];

		tags.concat(
			findTagsInText(translationText).map((t) => ({
				tag_id: t,
				lang
			}))
		);
	});
	console.log(tags);
	return tags;
}
