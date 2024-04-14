import { and, eq, sql } from 'drizzle-orm';
import { db } from '$lib/services/db';

import { articles } from '../article/schemas';
import type { UserService } from '../auth/service';
import type { TranslationInsert } from '../i18n/parsers';
import type { TranslationService } from '../i18n/service';
import type { TagDelete, TagUpdate } from './parsers';
import { tags, tagsToArticles } from './schemas';

export class TagService {
	private readonly userService: UserService;
	private readonly translationService: TranslationService;

	constructor(userService: UserService, translationService: TranslationService) {
		this.userService = userService;
		this.translationService = translationService;
	}

	async create(translation: TranslationInsert) {
		const user = await this.userService.getOrThrow();
		return db.transaction(async (trx) => {
			const [{ key }] = await this.translationService.create([translation], 'disallow-empty', trx);
			return trx
				.insert(tags)
				.values({ name_translation_key: key, user_id: user.id })
				.returning()
				.get();
		});
	}
	async delete(tag: TagDelete) {
		const user = await this.userService.getOrThrow();
		return db
			.delete(tags)
			.where(and(eq(tags.id, tag.id), eq(tags.user_id, user.id)))
			.run();
	}
	async switchChecked(tag: TagUpdate, slug: string) {
		const user = await this.userService.getOrThrow();
		const currentlyChecked = tag.checked;
		const articleSql = sql`${db
			.select({ id: articles.id })
			.from(articles)
			.where(and(eq(articles.slug, slug), eq(articles.user_id, user.id)))}`;
		const tagSql = sql`${db
			.select({ id: tags.id })
			.from(tags)
			.where(and(eq(tags.id, tag.id), eq(tags.user_id, user.id)))}`;

		if (currentlyChecked) {
			await db
				.delete(tagsToArticles)
				.where(and(eq(tagsToArticles.tag_id, tagSql), eq(tagsToArticles.article_id, articleSql)))
				.run();
		} else {
			await db.insert(tagsToArticles).values({ tag_id: tagSql, article_id: articleSql }).run();
		}
	}
}
