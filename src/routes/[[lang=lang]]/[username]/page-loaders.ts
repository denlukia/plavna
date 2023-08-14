import type {
	PageLoad as DefaultPageLoad,
	PageServerLoad as DefaultPageServerLoad
} from './$types';
import type {
	PageLoad as NamedPageLoad,
	PageServerLoad as NamedPageServerLoad
} from './page-[pagename]/$types';

// Page Viewer ---------------------------------------------------------------
type PageViewerServerLoadEvent =
	| Parameters<DefaultPageServerLoad>[0]
	| Parameters<NamedPageServerLoad>[0];
type PageViewerServerLoad = DefaultPageServerLoad | NamedPageServerLoad;
type PageViewerLoadEvent = Parameters<DefaultPageLoad> | Parameters<NamedPageLoad>;
type PageViewerLoad = DefaultPageLoad | NamedPageLoad;

export const pageServerLoad = (async ({
	params,
	parent,
	locals: { plavna }
}: PageViewerServerLoadEvent) => {
	const { username } = params;

	let pagename = '';
	if ('pagename' in params) {
		pagename = params.pagename;
	}
	const result = await plavna.pages.getOneWithSectionsAndPosts(username, pagename);
	const { translations } = await parent();
	return { result, translations: { ...translations } };
}) satisfies PageViewerServerLoad;
