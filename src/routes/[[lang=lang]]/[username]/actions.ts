import { LibsqlError } from '@libsql/client';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { ZodError } from 'zod';

import { generatePath } from '$lib/common/url';
import { db } from '$lib/server/db';
import { type PostInsert, post, translation } from '$lib/server/db/schema';

import type { TranslationKey } from '$lib/server/i18n/system-translations/en';
import type { TranslationsFromForm } from '$lib/server/utils';
import type { RouteParams } from './$types';
import type { Redirect, RequestEvent } from '@sveltejs/kit';
import type { User } from 'lucia-auth';

async function createPost(
	translations: TranslationsFromForm,
	userId: string,
	slug: string,
	publish: boolean | null
) {
	await db.transaction(async (trx) => {
		const { lastInsertRowid: titleTransId } = await trx
			.insert(translation)
			.values({
				...translations,
				_id: undefined,
				user_id: userId
			})
			.run();
		await trx
			.insert(post)
			.values({
				user_id: userId,
				slug: slug,
				title_translation_id: Number(titleTransId),
				published_at: publish ? new Date() : null
			})
			.run();
	});
}

async function updatePost(
	translations: TranslationsFromForm & { _id: number },
	user: User,
	postId: number,
	slug: string,
	publish: boolean | null
) {
	await db.transaction(async (trx) => {
		await trx
			.update(translation)
			.set({
				...translations
			})
			.where(and(eq(translation.user_id, user.id), eq(translation._id, translations._id)))
			.run();
		const newPostValues = { slug } as Partial<PostInsert>;
		if (publish !== null) newPostValues.published_at = publish ? new Date() : null;
		await trx.update(post).set(newPostValues).where(eq(post.id, postId)).run();
	});
}

function chooseErrorKey(e: any, slug: string) {
	let errorKey: TranslationKey = 'couldnt_save_post';
	if (e instanceof ZodError) {
		errorKey = 'invalid_slug';
	}
	if (e instanceof LibsqlError && e.message.includes('UNIQUE constraint failed')) {
		errorKey = slug ? 'slug_in_use' : 'only_one_default_slug';
	}
	return errorKey;
}

async function savePost(
	request: Request,
	locals: App.Locals,
	params: RouteParams,
	url: URL,
	publish: boolean | null
) {
	const { user, translations, postId, slug } = await validateData(request, locals, params);

	try {
		if (translations._id !== null && postId !== null) {
			type TranslationsWithId = typeof translations & { _id: number };
			await updatePost(translations as TranslationsWithId, user, postId, slug, publish);
		} else {
			await createPost(translations, user.id, slug, publish);
		}
		const correctPath = generatePath('/[lang]/[username]/[slug]/edit', {
			'[lang]': params.lang || '',
			'[username]': params.username,
			'[slug]': slug
		});
		if (url.pathname !== correctPath) {
			throw redirect(302, correctPath);
		}
	} catch (e) {
		if ((e as Redirect).location) throw e;
		let errorKey = chooseErrorKey(e, slug);
		return fail(400, { save: { slug, errorKey } });
	}
}

type ActionRequestEvt = RequestEvent<RouteParams, '/[[lang=lang]]/[username]/[post]/edit'>;

export const actions = {
	save: ({ request, locals, params, url }: ActionRequestEvt) =>
		savePost(request, locals, params, url, null),
	publish: ({ request, locals, params, url }: ActionRequestEvt) =>
		savePost(request, locals, params, url, true),
	hide: ({ request, locals, params, url }: ActionRequestEvt) =>
		savePost(request, locals, params, url, false)
};
