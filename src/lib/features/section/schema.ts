import { supportedLangs } from '@denlukia/plavna-common/constants';
import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from '$lib/features/auth/schema';
import { pages } from '$lib/features/page/schema';

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

export const sectionsRelations = relations(sections, ({ one, many }) => ({
	page: one(pages, {
		fields: [sections.page_id],
		references: [pages.id]
	}),
	title_translation: one(translations, {
		fields: [sections.title_translation_key],
		references: [translations.key]
	}),
	sectionsToTags: many(sectionsToTags)
}));

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

export const sectionsToTagsRelations = relations(sectionsToTags, ({ one }) => ({
	section: one(sections, {
		fields: [sectionsToTags.section_id],
		references: [sections.id]
	}),
	tag: one(tags, {
		fields: [sectionsToTags.tag_id],
		references: [tags.id]
	})
}));
