import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { table_users } from '$lib/user/schema';

import { table_translations } from '../i18n/schema';
import { table_images } from '../image/schema';

export const table_previewTemplates = sqliteTable('preview_templates', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_key: integer('name_translation_key')
		.notNull()
		.references(() => table_translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
	image_id: integer('image_id').references(() => table_images.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	url: text('url').notNull()
});
