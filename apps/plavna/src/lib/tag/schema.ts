import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { table_users } from '$lib/user/schema';

import { table_articles } from '../article/schema';
import { table_translations } from '../i18n/schema';

export const table_tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_key: integer('name_translation_key')
		.notNull()
		.references(() => table_translations.key, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const table_tags_to_articles = sqliteTable(
	'tags_to_articles',
	{
		tag_id: integer('tag_id')
			.notNull()
			.references(() => table_tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		article_id: integer('article_id')
			.notNull()
			.references(() => table_articles.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			pk: primaryKey(table.tag_id, table.article_id)
		};
	}
);
