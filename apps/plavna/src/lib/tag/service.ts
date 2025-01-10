import { and, eq, sql } from 'drizzle-orm';
import { db } from '$lib/db/db';

import { table_articles } from '../article/schema';
import type { TranslationService } from '../i18n/service';
import type { TranslationInsert } from '../i18n/validators';
import type { ActorService } from '../user/service';
import { table_tags, table_tags_to_articles } from './schema';
import type { TagDelete, TagUpdate } from './validators';

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
				.insert(table_tags)
				.values({ name_translation_key: key, user_id: actor.id })
				.returning()
				.get();
		});
	}
	async delete(tag: TagDelete) {
		const actor = await this.actorService.getOrThrow();
		return db
			.delete(table_tags)
			.where(and(eq(table_tags.id, tag.id), eq(table_tags.user_id, actor.id)))
			.run();
	}
	async switchChecked(tag: TagUpdate, slug: string) {
		const actor = await this.actorService.getOrThrow();
		const currentlyChecked = tag.checked;
		const articleSql = sql`${db
			.select({ id: table_articles.id })
			.from(table_articles)
			.where(and(eq(table_articles.slug, slug), eq(table_articles.user_id, actor.id)))}`;
		const tagSql = sql`${db
			.select({ id: table_tags.id })
			.from(table_tags)
			.where(and(eq(table_tags.id, tag.id), eq(table_tags.user_id, actor.id)))}`;

		if (currentlyChecked) {
			await db
				.delete(table_tags_to_articles)
				.where(
					and(
						eq(table_tags_to_articles.tag_id, tagSql),
						eq(table_tags_to_articles.article_id, articleSql)
					)
				)
				.run();
		} else {
			await db
				.insert(table_tags_to_articles)
				.values({ tag_id: tagSql, article_id: articleSql })
				.run();
		}
	}
}
