import { slugToTitle } from '../page/utils';

export function getTitle(
	params: { username?: string; pageslug?: string; articleslug?: string },
	articleName?: string
) {
	const username = params.username ? slugToTitle(params.username) : '';
	const pagename = params.pageslug ? slugToTitle(params.pageslug) : '';
	const finalArticleName = articleName
		? articleName
		: params.articleslug
			? slugToTitle(params.articleslug)
			: '';
	const serviceName = 'Plavna';

	const parts = [finalArticleName, pagename, username, serviceName];

	const result = parts.filter(Boolean).join(' | ');

	return result;
}
