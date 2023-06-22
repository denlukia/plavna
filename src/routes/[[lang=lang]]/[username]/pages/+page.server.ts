import { LibsqlError } from '@libsql/client';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { ZodError } from 'zod';

import { Slug } from '$lib/isomorphic/parsers';
import { transGroups } from '$lib/server/i18n';
import { userpages } from '$lib/server/schemas/db';
import { db } from '$lib/server/services/db';

import type { TranslationKey } from '$lib/server/i18n/system-translations/en';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const { user } = await locals.auth.validateUser();

	const pages = await db.select().from(userpages).where(eq(userpages.user_id, user.id)).all();
	const { translations } = await parent();

	return {
		pages,
		translations: { ...translations, ...transGroups.userPages(params.lang) }
	};
};

export const actions = {
	create: async ({ request, locals }) => {
		const { user } = await locals.auth.validateUser();

		const formData = await request.formData();
		const slug = formData.get('slug');

		try {
			const parsedSlug = slug ? Slug.parse(slug) : '';
			await db
				.insert(userpages)
				.values({
					user_id: user.id,
					slug: parsedSlug
				})
				.run();
		} catch (e) {
			let errorKey: TranslationKey = 'couldnt_create_page';
			if (e instanceof ZodError) {
				errorKey = 'invalid_slug';
			}
			if (e instanceof LibsqlError && e.message.includes('UNIQUE constraint failed')) {
				errorKey = slug ? 'slug_in_use' : 'only_one_default_slug';
			}
			return fail(400, { creation: { slug, errorKey } });
		}
	},
	edit: async ({ request, locals }) => {
		const { user } = await locals.auth.validateUser();

		const formData = await request.formData();
		let id = Number(formData.get('id'));
		let slug = formData.get('slug');

		try {
			const parsedSlug = slug ? Slug.parse(slug) : '';
			await db
				.update(userpages)
				.set({ slug: parsedSlug })
				.where(and(eq(userpages.user_id, user.id), eq(userpages.id, id)))
				.run();
		} catch (e) {
			let errorKey: TranslationKey = 'couldnt_edit_page';
			if (e instanceof ZodError) {
				errorKey = 'invalid_slug';
			}
			return fail(400, { edit: { id, slug, errorKey } });
		}
	},
	delete: async ({ request, locals }) => {
		const { user } = await locals.auth.validateUser();

		const formData = await request.formData();
		const id = Number(formData.get('id'));

		try {
			await db
				.delete(userpages)
				.where(and(eq(userpages.user_id, user.id), eq(userpages.id, id)))
				.run();
		} catch (e) {
			let errorKey: TranslationKey = 'couldnt_delete_page';
			if (e instanceof ZodError) {
				errorKey = 'invalid_slug';
			}
			return fail(400, { deletion: { id, errorKey } });
		}
	}
};
