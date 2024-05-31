import { and, eq, sql } from 'drizzle-orm';
import { db } from '$lib/services/db';

import { articles } from '../article/schema';
import type { ActorService } from '../user/service';
import type { TranslationInsert } from '../i18n/parsers';
import type { TranslationService } from '../i18n/service';
import type { TagDelete, TagUpdate } from './parsers';
import { tags, tagsToArticles } from './schema';

export class TagService {
	private readonly actorService: ActorService;
	private readonly translationService: TranslationService;

	constructor(actorService: ActorService, translationService: TranslationService) {
		this.actorService = actorService;
		this.translationService = translationService;
	}

	async create(translation: TranslationInsert) {
		const actor = await this.actorService.getOrThrow();
		return db.transaction(async (trx) => {
			const [{ key }] = await this.translationService.create([translation], 'disallow-empty', trx);
			return trx
				.insert(tags)
				.values({ name_translation_key: key, user_id: actor.id })
				.returning()
				.get();
		});
	}
	async delete(tag: TagDelete) {
		const actor = await this.actorService.getOrThrow();
		return db
			.delete(tags)
			.where(and(eq(tags.id, tag.id), eq(tags.user_id, actor.id)))
			.run();
	}
	async switchChecked(tag: TagUpdate, slug: string) {
		const actor = await this.actorService.getOrThrow();
		const currentlyChecked = tag.checked;
		const articleSql = sql`${db
			.select({ id: articles.id })
			.from(articles)
			.where(and(eq(articles.slug, slug), eq(articles.user_id, actor.id)))}`;
		const tagSql = sql`${db
			.select({ id: tags.id })
			.from(tags)
			.where(and(eq(tags.id, tag.id), eq(tags.user_id, actor.id)))}`;

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
