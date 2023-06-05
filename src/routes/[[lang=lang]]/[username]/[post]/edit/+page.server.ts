import { db } from '$lib/server/db';
import { post } from '$lib/server/db/schema';
import type { PossibleTransKey } from '$lib/server/i18n/system-translations/en';
import { ZodError } from 'zod';
import type { PageServerLoad } from './$types';
import { LibsqlError } from '@libsql/client';
import { fail } from '@sveltejs/kit';
import { Slug } from '$lib/common/validators';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request, locals }) => {
		const { user } = await locals.auth.validateUser();

		const formData = await request.formData();
		const slug = formData.get('slug');

		try {
			const titleTranslation = 1;
			const parsedSlug = Slug.parse(slug);
			await db
				.insert(post)
				.values({
					user_id: user.id,
					slug: parsedSlug,
					titleTranslation
				})
				.run();
		} catch (e) {
			// let errorKey: PossibleTransKey = 'couldnt_create_page';
			// if (e instanceof ZodError) {
			// 	errorKey = 'invalid_slug';
			// }
			// if (e instanceof LibsqlError && e.message.includes('UNIQUE constraint failed')) {
			// 	errorKey = slug ? 'slug_in_use' : 'only_one_default_slug';
			// }
			// return fail(400, { creation: { slug, errorKey } });
		}
	}
};
