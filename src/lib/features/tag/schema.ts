import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from '$lib/features/auth/schema';

import { articles } from '../article/schema';
import { translations } from '../i18n/schema';
import { sectionsToTags } from '../section/schema';

export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_key: integer('name_translation_key')
		.notNull()
		.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const tagsToArticles = sqliteTable(
	'tags_to_articles',
	{
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		article_id: integer('article_id')
			.notNull()
			.references(() => articles.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			pk: primaryKey(table.tag_id, table.article_id)
		};
	}
);
