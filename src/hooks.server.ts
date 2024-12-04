import type { Handle } from '@sveltejs/kit';
import { ArticleService } from '$lib/features/article/service';
import { TranslationService } from '$lib/features/i18n/service';
import { getLang } from '$lib/features/i18n/utils';
import { ImageService } from '$lib/features/image/service';
import { PageService } from '$lib/features/page/service';
import { PreviewService } from '$lib/features/preview/service';
import { SectionService } from '$lib/features/section/service';
import { TagService } from '$lib/features/tag/service';
import { ActorService } from '$lib/features/user/service';
import { lucia } from '$lib/services/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, params } = event;

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

	return await resolve(event);
};
