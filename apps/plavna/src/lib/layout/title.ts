import { slugToTitle } from '../page/utils';

export function getTitle(params: { username?: string; pageslug?: string }, prefix?: string) {
	const username = params.username ? slugToTitle(params.username) : '';
	const pagename = params.pageslug ? slugToTitle(params.pageslug) : '';
	const serviceName = 'Plavna';

	const parts = [prefix, pagename, username, serviceName];

	return parts.filter(Boolean).join(' | ');
}
