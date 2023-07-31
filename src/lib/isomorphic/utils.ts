import type { TagSelect } from '$lib/server/domain/types';
import type { marked } from 'marked';

export function findTagIdsInLinks(tokens: marked.TokensList) {
	const tags: TagSelect['id'][] = [];
	function parseTokensArray(tokens: marked.TokensList) {
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
