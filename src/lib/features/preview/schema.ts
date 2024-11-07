import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from '$lib/features/user/schema';

import { translations } from '../i18n/schema';
import { images } from '../image/schema';

export const previewTemplates = sqliteTable('preview_templates', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_key: integer('name_translation_key')
		.notNull()
		.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
	image_id: integer('image_id').references(() => images.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	url: text('url').notNull()
});
