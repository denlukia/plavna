import { integer, sqliteTable, text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { table_users } from '$lib/features/user/schema';

import { table_articles } from '../article/schema';
import { table_translations } from '../i18n/schema';

export const table_images = sqliteTable('images', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	// TODO: rename to smth like "common"
	is_account_common: integer('is_account_common', { mode: 'boolean' }).notNull().default(false),
	owning_article_id: integer('owning_article_id').references(
		(): AnySQLiteColumn => table_articles.id,
		{
			onDelete: 'set null',
			onUpdate: 'cascade'
		}
	),
	source: text('source', { enum: ['imagekit'] }),
	path: text('path'),
	path_translation_key: integer('path_translation_key').references(() => table_translations.key, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	}),
	background: text('background'),
	width: integer('width'),
	height: integer('height')
});
