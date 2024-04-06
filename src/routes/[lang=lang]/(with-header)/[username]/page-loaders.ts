import type { PageServerLoad as DefaultPageServerLoad } from './$types';
import type { PageServerLoad as NamedPageServerLoad } from './page-[pagename]/$types';

type PageViewerServerLoadEvent =
	| Parameters<DefaultPageServerLoad>[0]
	| Parameters<NamedPageServerLoad>[0];
type PageViewerServerLoad = DefaultPageServerLoad | NamedPageServerLoad;

export const pageServerLoad = (async ({
	params,

	locals: { plavna }
}: PageViewerServerLoadEvent) => {
	const { username } = params;

	let pagename = '';
	if ('pagename' in params) {
		pagename = params.pagename;
	}
	const result = await plavna.pages.getOneWithSectionsAndArticles(username, pagename);

	return { ...result, recordsTranslations: result.translations };
}) satisfies PageViewerServerLoad;
