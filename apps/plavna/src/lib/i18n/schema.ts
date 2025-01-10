import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { table_users } from '$lib/user/schema';

export const table_translations = sqliteTable('translations', {
	// It's "key" because "id" is Indonasian lang code
	key: integer('key').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => table_users.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	en: text('en'),
	uk: text('uk')
});
