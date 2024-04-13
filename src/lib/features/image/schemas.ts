import { integer, sqliteTable, text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { users } from '$lib/features/auth/schemas';

import { articles } from '../article/schemas';
import { translations } from '../i18n/schemas';

export const images = sqliteTable('images', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	is_account_common: integer('is_account_common', { mode: 'boolean' }).notNull().default(false),
	owning_article_id: integer('owning_article_id').references((): AnySQLiteColumn => articles.id, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	}),
	source: text('source', { enum: ['imagekit'] }),
	path: text('path'),
	path_translation_key: integer('path_translation_key').references(() => translations.key, {
		onDelete: 'set null',
		onUpdate: 'cascade'
	}),
	background: text('background'),
	width: integer('width'),
	height: integer('height')
});
