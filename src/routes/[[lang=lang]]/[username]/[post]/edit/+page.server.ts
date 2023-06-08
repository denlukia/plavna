import { db } from '$lib/server/db';
import { post, translation, user } from '$lib/server/db/schema';
import type { PossibleTransKey } from '$lib/server/i18n/system-translations/en';
import { ZodError } from 'zod';
import type { PageServerLoad } from './$types';
import { LibsqlError } from '@libsql/client';
import { fail, redirect } from '@sveltejs/kit';
import { Slug } from '$lib/common/validators';
import { and, eq } from 'drizzle-orm';
import { defaultLang, type SupportedLang } from '$lib/common/languages';
import { generatePath } from '$lib/common/url';
import type { Redirect } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {
	const { username, post: postSlug, lang } = params;
	const userSq = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.username, username))
		.get();
	const postRecord = await db.query.post.findFirst({
		where: and(eq(post.slug, postSlug), eq(post.user_id, userSq.id)),
		with: { title_translation: { columns: { _id: true, [lang || defaultLang]: true } } }
	});
	return { post: postRecord };
}) satisfies PageServerLoad;

type TranslationsFromForm = {
	[key in SupportedLang | '_id']: string;
};

function getTranslationsFromForm(formData: FormData, searchPrefix: string): TranslationsFromForm {
	const formObj = Object.fromEntries(formData.entries());
	const objEntries = Object.entries(formObj);
	const onlyPrefixedEntries = objEntries.filter(([key]) => {
		if (key.split('.')[0] === searchPrefix) return true;
	});
	const prefixRemovedEntries = onlyPrefixedEntries.map(([key, value]) => {
		const newKey = key.split('.').slice(1).join('.');
		return [newKey, value];
	});
	return Object.fromEntries(prefixRemovedEntries);
}

export const actions = {
	update: async ({ request, locals, params }) => {
		const { user } = await locals.auth.validateUser();

		const formData = await request.formData();
		const titleTranslations = getTranslationsFromForm(formData, 'title_translation');
		const postId = Number(formData.get('id'));
		const slug = formData.get('slug');

		try {
			const parsedSlug = Slug.parse(slug);
			await db.transaction(async (trx) => {
				let { _id, ...translations } = titleTranslations;
				let titleTransId = Number(_id);
				if (titleTransId) {
					// TODO Can't we update translations of wrong users here?
					await trx
						.update(translation)
						.set({
							...translations
						})
						.where(eq(translation._id, titleTransId))
						.run();
				} else {
					const resultSet = await trx
						.insert(translation)
						.values({
							...translations
						})
						.run();
					if (resultSet.lastInsertRowid) titleTransId = Number(resultSet.lastInsertRowid);
				}
				if (postId) {
					await trx
						.update(post)
						.set({ slug: parsedSlug, title_translation_id: titleTransId })
						.where(eq(post.id, postId))
						.run();
				} else {
					const values = {
						user_id: user?.id ?? '',
						slug: parsedSlug,
						title_translation_id: titleTransId
					};
					await trx.insert(post).values(values).run();
				}
			});
			throw redirect(
				302,
				generatePath('/[lang]/[username]/[slug]/edit', {
					'[lang]': params.lang || '',
					'[username]': params.username,
					'[slug]': String(slug)
				})
			);
		} catch (e) {
			if ((e as Redirect).location) throw e;

			let errorKey: PossibleTransKey = 'couldnt_save_post';
			if (e instanceof ZodError) {
				errorKey = 'invalid_slug';
			}
			if (e instanceof LibsqlError && e.message.includes('UNIQUE constraint failed')) {
				errorKey = slug ? 'slug_in_use' : 'only_one_default_slug';
			}
			return fail(400, { save: { slug, errorKey } });
		}
	}
};
