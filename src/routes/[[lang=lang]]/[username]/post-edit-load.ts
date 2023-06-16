import { getPostWithTranslations } from './common';
import { error } from '@sveltejs/kit';
import { isNotNull } from 'drizzle-orm';

import { post } from '$lib/server/db/schema';

import type { PageServerLoad } from './[post]/$types';

export const load = (async ({ params, locals }) => {
	const { user: userObj } = await locals.auth.validateUser();
	const { username, post: postSlug } = params;

	const actorIsAuthor = userObj && username === userObj.username;
	const additionalCheck = actorIsAuthor ? undefined : isNotNull(post.published_at);

	try {
		const response = await getPostWithTranslations(postSlug, username, additionalCheck);
		if (response) {
		} else {
			throw error(404);
		}
	} catch (e: any) {
		console.log('Error while fetching post', e);
		if (e.status === 404) throw e;
	}
}) satisfies PageServerLoad;
