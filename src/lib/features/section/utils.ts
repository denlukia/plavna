import { supportedLangs } from '@denlukia/plavna-common/constants';
import { marked, type Token, type TokensList } from 'marked';

import type { TagSelect } from '../tag/parsers';
import type { SectionInsert } from './parsers';
import type { TagIdWithLang } from './types';

export function findTagIdsInLinks(tokens: TokensList) {
	const tags: TagSelect['id'][] = [];
	function parseTokensArray(tokens: Token[]) {
		tokens.forEach((token) => {
			if (token.type === 'link' && token.href.startsWith('tag:')) {
				const tagId = Number(token.href.split('tag:')[1]);

				tags.push(tagId);
			}

			if ('tokens' in token && token.tokens) {
				parseTokensArray(token.tokens);
			}
		});
	}
	parseTokensArray(tokens);
	return tags;
}

export function findTagsInSectionTranslations(translations: SectionInsert): TagIdWithLang[] {
	const tagIds = [] as TagIdWithLang[];

	supportedLangs.forEach((lang) => {
		const translationText = translations[lang];
		if (!translationText) return;

		const tokens = marked.lexer(translationText);

		const foundTagIds = findTagIdsInLinks(tokens);

		tagIds.push(...foundTagIds.map((tid) => ({ tag_id: tid, lang })));
	});

	return tagIds;
}
