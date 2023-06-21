import { SQL, and, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import {
	type PostSelect,
	type TranslationSelect,
	posts,
	translations,
	users
} from '$lib/server/db/schema';

export type ExtendedPost = PostSelect & {
	title_translation: TranslationSelect;
};
export async function getPostWithTranslations(
	postSlug: string,
	username: string,
	additionalCheck: SQL<unknown> | undefined
) {
	const response = await db
		.select({ post: posts, title_translation: translations })
		.from(posts)
		.innerJoin(users, eq(posts.user_id, users.id))
		.innerJoin(translations, eq(posts.title_translation_id, translations._id))
		.where(and(eq(posts.slug, postSlug), eq(users.username, username), additionalCheck))
		.get();
	if (response) {
		const postObj = response.post as ExtendedPost;
		postObj.title_translation = response.title_translation;
		return postObj;
	} else {
		return;
	}
}
