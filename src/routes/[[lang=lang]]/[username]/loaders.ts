import { getPostWithTranslations } from './query';
import { error } from '@sveltejs/kit';
import { isNotNull } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';

import { PostFormParser } from '$lib/isomorphic/parsers';
import { posts } from '$lib/server/schemas/db';
import { flatify } from '$lib/server/utils/objects';
import { getUserOrThrow } from '$lib/server/utils/user';

import type { PageServerLoad, RouteParams } from './[post]/$types';

async function loadBase(params: RouteParams, locals: App.Locals) {
	const userObj = await getUserOrThrow(locals, params);
	const { username, post: postSlug } = params;

	const actorIsAuthor = userObj && username === userObj.username;
	const additionalCheck = actorIsAuthor ? undefined : isNotNull(posts.published_at);

	const response = await getPostWithTranslations(postSlug, username, additionalCheck);
	if (!response) throw error(404);

	return response;
}

export const postEditorLoad = (async ({ params, locals }) => {
	const response = await loadBase(params, locals);
	const flatResponse = flatify(response);
	const form = await superValidate(flatResponse, PostFormParser);

	return { form };
}) satisfies PageServerLoad;

export const postLoad = (async ({ params, locals }) => {
	const response = await loadBase(params, locals);
	return { post: response };
}) satisfies PageServerLoad;
