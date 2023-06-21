import { getPostWithTranslations } from './query';
import { error } from '@sveltejs/kit';
import { isNotNull } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

import { PostFormParser } from '$lib/client-server/parsers';
import { flatify } from '$lib/client-server/utils/objects';
import { posts } from '$lib/server/db/schema';
import { getUserOrThrow } from '$lib/server/utils';

import type { PageServerLoad } from './[post]/$types';

export const postEditorLoad = (async ({ params, locals }) => {
	const userObj = await getUserOrThrow(locals, params);
	const { username, post: postSlug } = params;

	const actorIsAuthor = userObj && username === userObj.username;
	const additionalCheck = actorIsAuthor ? undefined : isNotNull(posts.published_at);

	try {
		const response = await getPostWithTranslations(postSlug, username, additionalCheck);
		if (!response) throw error(404);

		const flatResponse = flatify(response);
		const form = await superValidate(flatResponse, PostFormParser);

		return { form };
	} catch (e: any) {
		console.log('Error while fetching post', e);
		if (e.status === 404) throw e;
	}
}) satisfies PageServerLoad;

export const postLoad = (async ({ params, route, locals }) => {
	const userObj = await getUserOrThrow(locals, params);
	const { username, post: postSlug } = params;

	const actorIsAuthor = userObj && username === userObj.username;
	const additionalCheck = actorIsAuthor ? undefined : isNotNull(posts.published_at);

	try {
		const response = await getPostWithTranslations(postSlug, username, additionalCheck);
		if (response) {
			return { post: response };
		} else {
			throw error(404);
		}
	} catch (e: any) {
		console.log('Error while fetching post', e);
		if (e.status === 404) throw e;
	}
}) satisfies PageServerLoad;
