import { supportedLangs } from '@denlukia/plavna-common/constants';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { table_pages } from '$lib/features/page/schema';
import { table_users } from '$lib/features/user/schema';

import { table_translations } from '../i18n/schema';
import { table_tags } from '../tag/schema';

export const table_sections = sqliteTable('sections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id')
		.notNull()
		.references(() => table_pages.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: text('user_id')
		.notNull()
		.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	title_translation_key: integer('title_translation_key')
		.notNull()
		.references(() => table_translations.key, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const table_sectionsToTags = sqliteTable(
	'sections_to_tags',
	{
		section_id: integer('section_id')
			.notNull()
			.references(() => table_sections.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		tag_id: integer('tag_id')
			.notNull()
			.references(() => table_tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		lang: text('lang', { enum: supportedLangs }).notNull()
	},
	(table) => {
		return {
			pk: primaryKey(table.section_id, table.tag_id, table.lang)
		};
	}
);
