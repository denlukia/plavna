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
		const newURL = new URL(incoming);
		newURL.pathname = pathname;

		const newURLSTring = newURL.toString();

		// SvelteKit has actions under query params like ?/create_todo
		// which by some code before middlewares get converted to ?%2Fcreate_todo
		// we have to fix that
		const fixedURLSstring = newURLSTring.replace('%2F', '/');
		console.log('Fixed outgoing');

		return rewrite(fixedURLSstring);
	} else {
		return next(request);
	}
}
