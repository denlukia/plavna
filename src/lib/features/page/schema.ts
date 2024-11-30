import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { themes } from '$lib/design/themes/themes';

import { table_users } from '../user/schema';

export const table_pages = sqliteTable(
	'pages',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull(),
		color_theme: text('color_theme', { enum: themes.color }).notNull().default(themes.color[0]),
		style_theme: text('style_theme', { enum: themes.style }).notNull().default(themes.style[0]),
		typography_functional_theme: text('typography_functional_theme', {
			enum: themes['typography/functional']
		})
			.notNull()
			.default(themes['typography/functional'][0]),
		typography_aesthetic_theme: text('typography_aesthetic_theme', {
			enum: themes['typography/aesthetic']
		})
			.notNull()
			.default(themes['typography/aesthetic'][0])
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_pages_unique_user_slug').on(table.user_id, table.slug)
		};
	}
);
