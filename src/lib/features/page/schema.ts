import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { themes } from '../themes/themes';
import { table_users } from '../user/schema';

export const table_pages = sqliteTable(
	'pages',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull(),
		color_theme: text('color_theme').notNull().default(themes.color[0]),
		style_theme: text('style_theme').notNull().default(themes.style[0]),
		typography_theme: text('typography_theme').notNull().default(themes.typography[0])
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_pages_unique_user_slug').on(table.user_id, table.slug)
		};
	}
);
