import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { users } from '../user/schema';
import { sections } from '../section/schema';

export const pages = sqliteTable(
	'pages',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull()
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_pages_unique_user_slug').on(table.user_id, table.slug)
		};
	}
);
export const pagesRelations = relations(pages, ({ many }) => ({
	sections: many(sections)
}));
