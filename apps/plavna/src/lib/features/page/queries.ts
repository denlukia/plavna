import { and, eq } from 'drizzle-orm';
import { db } from '$lib/services/db';

import { table_users } from '../user/schema';
import { table_pages } from './schema';

export function queryGetThemes(username: string, pageslug: string) {
	return db
		.select({
			color_theme: table_pages.color_theme,
			style_theme: table_pages.style_theme,
			typography_interface_theme: table_pages.typography_interface_theme,
			typography_markdown_theme: table_pages.typography_markdown_theme
		})
		.from(table_users)
		.innerJoin(
			table_pages,
			and(eq(table_pages.slug, pageslug), eq(table_pages.user_id, table_users.id))
		)
		.where(eq(table_users.username, username))
		.limit(1)
		.get();
}
