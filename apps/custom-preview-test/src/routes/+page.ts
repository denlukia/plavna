import type { ArticlePreviewScreenshotQuery } from '$lib/types';

export function load({ url }) {
	// get all query params from url object
	const queryParams = new URLSearchParams(url.search);
	const params = Object.fromEntries(queryParams.entries()) as ArticlePreviewScreenshotQuery;

	return { params };
}
