import { reroute } from '__HOOKS__';
import { next, rewrite } from '@vercel/edge';

/**
 * @param {Request} request
 * @returns {Response}
 */
export default function middleware(request) {
	const incoming = request.url;
	console.log('Incoming:', incoming);
	const pathname = reroute({ url: new URL(incoming) });
	if (pathname) {
		const newUrl = new URL(incoming);
		newUrl.pathname = pathname;
		console.log('Rewritten:', JSON.stringify(newUrl));
		return rewrite(newUrl);
	} else {
		return next(request);
	}
}
