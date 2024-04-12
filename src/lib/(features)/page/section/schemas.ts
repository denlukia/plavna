import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from '$lib/(features)/auth/schemas';
import { pages } from '$lib/(features)/pages-list/schemas';
import { sectionsToTags, translations } from '$lib/server/collections/db-schema';

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
