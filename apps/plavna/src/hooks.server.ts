import type { Handle } from '@sveltejs/kit';
import { ArticleService } from '$lib/article/service';
import { TranslationService } from '$lib/i18n/service';
import { getLang } from '$lib/i18n/utils';
import { ImageService } from '$lib/image/service';
import { PageService } from '$lib/page/service';
import { PreviewService } from '$lib/preview/service';
import { SectionService } from '$lib/section/service';
import { TagService } from '$lib/tag/service';
import { lucia } from '$lib/user/auth';
import { ActorService } from '$lib/user/service';

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, params } = event;

	const headers = event.request.headers;
	if (headers.get('user-agent')?.includes('Google') && !headers.has('accept')) {
		headers.set('accept', 'text/html');
	}

	const beforeAuth = performance.now();

	locals.lang = getLang(params.lang);
	locals.session = null;
	locals.actor = null;

	// 1. Handling auth with Lucia
	const sessionId = cookies.get(lucia.sessionCookieName);
	if (sessionId) {
		const { session, user } = await lucia.validateSession(sessionId);

		locals.session = session;
		locals.actor = user;

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
	}

	// 2. Adding our Services
	locals.actorService = new ActorService(locals.actor);
	locals.translationService = new TranslationService(locals.actorService, getLang(params.lang));

	locals.sectionService = new SectionService(locals.actorService, locals.translationService);
	locals.pageService = new PageService(
		locals.actorService,
		locals.translationService,
		locals.sectionService
	);
	locals.tagService = new TagService(locals.actorService, locals.translationService);
	locals.imageService = new ImageService(locals.actorService, locals.translationService);
	locals.articleService = new ArticleService(
		locals.actorService,
		locals.translationService,
		locals.imageService
	);
	locals.previewService = new PreviewService(
		locals.actorService,
		locals.translationService,
		locals.imageService
	);

	// 3. Timing the whole and restoring original fetch
	const url = event.url.pathname;
	console.log('--------- Perf for page:', url);
	console.log(`Auth: ${(performance.now() - beforeAuth).toFixed(2)}ms`);

	const beforeResolve = performance.now();
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locals.lang)
	});
	console.log(`Resolve: ${(performance.now() - beforeResolve).toFixed(2)}ms`);

	return response;
};
