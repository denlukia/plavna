import { fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { PostFormParser, type PostSchema, type PostWithIdSchema } from '$lib/client-server/parsers';
import { generatePath } from '$lib/client-server/url';
import { nestify } from '$lib/client-server/utils/objects';
import { db } from '$lib/server/db';
import { type PostInsert, posts, translations } from '$lib/server/db/schema';
import { getUserOrThrow } from '$lib/server/utils';

import type { RouteParams } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from 'lucia-auth';

async function createPost(post: PostSchema, user: User, publish?: boolean) {
	return await db.transaction(async (trx) => {
		const { lastInsertRowid: titleTransId } = await trx
			.insert(translations)
			.values({
				...post.title_translation,
				_id: undefined,
				user_id: user.id
			})
			.run();
		await trx
			.insert(posts)
			.values({
				user_id: user.id,
				slug: post.slug,
				title_translation_id: Number(titleTransId),
				published_at: publish ? new Date() : null
			})
			.run();
	});
}

async function updatePost(post: PostWithIdSchema, user: User, publish?: boolean) {
	return await db.transaction(async (trx) => {
		await trx
			.update(translations)
			.set({
				...post.title_translation
			})
			.where(
				and(eq(translations.user_id, user.id), eq(translations._id, post.title_translation._id))
			)
			.run();
		const postUpdateObj: Partial<PostInsert> = {
			slug: post.slug,
			published_at: publish === undefined ? undefined : publish ? new Date() : null
		};
		await trx.update(posts).set(postUpdateObj).where(eq(posts.id, post.id)).run();
	});
}

function isExistingPost(post: PostSchema): post is PostWithIdSchema {
	return typeof post.id === 'number' && typeof post.title_translation._id === 'number';
}

async function savePost({ locals, params, request, url }: ActionRequestEvt, publish?: boolean) {
	const user = await getUserOrThrow(locals, params);
	const form = await superValidate(request, PostFormParser);
	if (!form.valid) return fail(400, { form });

	const post = nestify(form.data);

	try {
		if (isExistingPost(post)) {
			await updatePost(post, user, publish);
		} else {
			await createPost(post, user, publish);
		}
	} catch (e) {
		return setError(form, '', 'Something went wrong');
	}

	const correctPath = generatePath('/[lang]/[username]/[slug]/edit', {
		'[lang]': params.lang,
		'[username]': params.username,
		'[slug]': post.slug
	});
	if (url.pathname !== correctPath) throw redirect(302, correctPath);
}

type ActionRequestEvt = RequestEvent<RouteParams, '/[[lang=lang]]/[username]/[post]/edit'>;
export const actions = {
	save: (event: ActionRequestEvt) => savePost(event),
	publish: (event: ActionRequestEvt) => savePost(event, true),
	hide: (event: ActionRequestEvt) => savePost(event, false)
};
