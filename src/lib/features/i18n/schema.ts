import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from '$lib/features/auth/schema';

export const translations = sqliteTable('translations', {
	// It's "key" because "id" is Indonasian lang code
	key: integer('key').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	en: text('en'),
	uk: text('uk')
});
