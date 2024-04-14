import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// TODO Capital names of tables in singular
// to deal with variable names for queries problem

export const users = sqliteTable(
	'auth_user',
	{
		id: text('id').primaryKey(),
		github_id: integer('github_id').unique().notNull(),
		username: text('username').unique().notNull(),
		imagekit_public_key: text('imagekit_public_key'),
		imagekit_private_key: text('imagekit_private_key'),
		imagekit_url_endpoint: text('imagekit_url_endpoint')
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_user_unique_username').on(table.username)
		};
	}
);

export const sessions = sqliteTable('auth_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull()
});
