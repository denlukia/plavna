import { SQL, and, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { post, translation, user } from '$lib/server/db/schema';

export async function getPostWithTranslations(
	postSlug: string,
	username: string,
	additionalCheck: SQL<unknown> | undefined
) {
	const response = await db
		.select({ post, title_translation: translation })
		.from(post)
		.innerJoin(user, eq(post.user_id, user.id))
		.innerJoin(translation, eq(post.title_translation_id, translation._id))
		.where(and(eq(post.slug, postSlug), eq(user.username, username), additionalCheck))
		.get();
	if (response) {
		type ExtendedPost = typeof response.post & {
			title_translation: typeof response.title_translation;
		};
		const postObj = response.post as ExtendedPost;
		postObj.title_translation = response.title_translation;
		return postObj;
	} else {
		return;
	}
}
