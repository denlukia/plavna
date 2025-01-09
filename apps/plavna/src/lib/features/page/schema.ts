import { allThemes } from '@plavna/design/theming';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { table_users } from '../user/schema';

export const table_pages = sqliteTable(
	'pages',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull(),
		color_theme: text('color_theme', { enum: allThemes.color })
			.notNull()
			.default(allThemes.color[0]),
		style_theme: text('style_theme', { enum: allThemes.style })
			.notNull()
			.default(allThemes.style[0]),
		typography_interface_theme: text('typography_functional_theme', {
			enum: allThemes['typographyInterface']
		})
			.notNull()
			.default(allThemes['typographyInterface'][0]),
		typography_markdown_theme: text('typography_aesthetic_theme', {
			enum: allThemes['typographyMarkdown']
		})
			.notNull()
			.default(allThemes['typographyMarkdown'][0])
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_pages_unique_user_slug').on(table.user_id, table.slug)
		};
	}
);
