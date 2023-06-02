import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { transGroups } from '$lib/server/i18n';
import { db } from '$lib/server/db';
import { userpage } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { AuthUser } from '$lib/server/auth';
import { PageId, Slug } from '$lib/common/validators';
import { ZodError } from 'zod';
import { LibsqlError } from '@libsql/client';
import type { PossibleTransKey } from '$lib/server/i18n/system-translations/en';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const { user }: { user: AuthUser } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/plavna/login');
	if (user.username !== params.username) throw error(404);

	const pages = await db.select().from(userpage).where(eq(userpage.user_id, user.userId)).all();
	const { translations } = await parent();

	return {
		pages,
		translations: { ...translations, ...transGroups.userPages(params.lang) }
	};
};

export const actions = {
	create: async ({ request, locals, params }) => {
		const { user }: { user: AuthUser } = await locals.auth.validateUser();
		if (!user) throw redirect(302, '/plavna/login');
		if (user.username !== params.username) throw error(403);

		const formData = await request.formData();
		const slug = formData.get('slug');

		try {
			const parsedSlug = slug ? Slug.parse(slug) : '';
			await db
				.insert(userpage)
				.values({
					user_id: user.userId,
					slug: parsedSlug
				})
				.run();
		} catch (e) {
			let errorKey: PossibleTransKey = 'couldnt_create_page';
			if (e instanceof ZodError) {
				errorKey = 'invalid_slug';
			}
			if (e instanceof LibsqlError && e.message.includes('UNIQUE constraint failed')) {
				errorKey = slug ? 'slug_in_use' : 'only_one_default_slug';
			}
			return fail(400, { creation: { slug, errorKey } });
		}
	},
	edit: async ({ request, locals, params }) => {
		const { user }: { user: AuthUser } = await locals.auth.validateUser();
		if (!user) throw redirect(302, '/plavna/login');
		if (user.username !== params.username) throw error(403);

		const formData = await request.formData();
		const id = formData.get('id');
		const slug = formData.get('slug');

		try {
			const parsedId = PageId.parse(id);
			const parsedSlug = slug ? Slug.parse(slug) : '';
			await db
				.update(userpage)
				.set({ slug: parsedSlug })
				.where(and(eq(userpage.user_id, user.userId), eq(userpage.id, parsedId)))
				.run();
		} catch (e) {
			let errorKey: PossibleTransKey = 'couldnt_edit_page';
			if (e instanceof ZodError) {
				errorKey = 'invalid_slug';
			}
			return fail(400, { edit: { slug, errorKey } });
		}
	},
	delete: async ({ request, locals, params }) => {
		const { user }: { user: AuthUser } = await locals.auth.validateUser();
		if (!user) throw redirect(302, '/plavna/login');
		if (user.username !== params.username) throw error(403);

		const formData = await request.formData();
		const slug = formData.get('slug');

		try {
			const parsedSlug = slug ? Slug.parse(slug) : '';
			await db
				.delete(userpage)
				.where(and(eq(userpage.user_id, user.userId), eq(userpage.slug, parsedSlug)))
				.run();
		} catch (e) {
			let errorKey: PossibleTransKey = 'couldnt_delete_page';
			if (e instanceof ZodError) {
				errorKey = 'invalid_slug';
			}
			return fail(400, { deletion: { slug, errorKey } });
		}
	}
};
