import { supportedLangs } from '@denlukia/plavna-common/constants';
import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { pages } from '$lib/features/page/schema';
import { users } from '$lib/features/user/schema';

import { translations } from '../i18n/schema';
import { tags } from '../tag/schema';

export const sections = sqliteTable('sections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id')
		.notNull()
		.references(() => pages.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	title_translation_key: integer('title_translation_key')
		.notNull()
		.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const sectionsToTags = sqliteTable(
	'sections_to_tags',
	{
		section_id: integer('section_id')
			.notNull()
			.references(() => sections.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		lang: text('lang', { enum: supportedLangs }).notNull()
	},
	(table) => {
		return {
			pk: primaryKey(table.section_id, table.tag_id, table.lang)
		};
	}
);
