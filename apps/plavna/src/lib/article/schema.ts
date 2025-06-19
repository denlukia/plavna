import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { table_users } from '$lib/user/schema';

import { table_translations } from '../i18n/schema';
import { table_images } from '../image/schema';
import { previewFamiliesIds } from '../preview/families';
import { table_previewTemplates } from '../preview/schema';
import { dynamicPreviewActivationConditions } from '../preview/types';

export const table_articles = sqliteTable(
	'articles',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => table_users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull(),
		title_translation_key: integer('title_translation_key')
			.notNull()
			.references(() => table_translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
		description_translation_key: integer('description_translation_key')
			.notNull()
			.references(() => table_translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
		content_translation_key: integer('content_translation_key')
			.notNull()
			.references(() => table_translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
		publish_time: integer('publish_time', { mode: 'timestamp' }),
		likes_count: integer('likes_count').notNull().default(0),
		preview_columns: integer('preview_columns').notNull().default(1),
		preview_rows: integer('preview_rows').notNull().default(1),
		preview_family: text('preview_family', { enum: previewFamiliesIds }),
		preview_template_id: integer('preview_template_id').references(
			() => table_previewTemplates.id,
			{
				onDelete: 'set null',
				onUpdate: 'cascade'
			}
		),
		preview_interactions_show_on: text('preview_interactions_show_on', {
			enum: dynamicPreviewActivationConditions
		}).default('hover'),
		preview_prop_1: text('preview_prop_1').default(''),
		preview_prop_2: text('preview_prop_2').default(''),
		preview_prop_3: text('preview_prop_3').default(''),
		preview_prop_4: text('preview_prop_4').default(''),
		preview_translation_1_key: integer('preview_translation_1_key')
			.notNull()
			.references(() => table_translations.key, { onDelete: 'set null', onUpdate: 'cascade' }),
		preview_translation_2_key: integer('preview_translation_2_key')
			.notNull()
			.references(() => table_translations.key, { onDelete: 'set null', onUpdate: 'cascade' }),
		preview_image_1_id: integer('preview_image_1_id')
			.notNull()
			.references(() => table_images.id, {
				onDelete: 'set null',
				onUpdate: 'cascade'
			}),
		preview_image_2_id: integer('preview_image_2_id')
			.notNull()
			.references(() => table_images.id, {
				onDelete: 'set null',
				onUpdate: 'cascade'
			}),
		preview_screenshot_image_id: integer('preview_screenshot_image_id').references(
			() => table_images.id,
			{
				onDelete: 'set null',
				onUpdate: 'cascade'
			}
		),
		preview_screenshot_in_article_image_id: integer(
			'preview_screenshot_in_article_image_id'
		).references(() => table_images.id, {
			onDelete: 'set null',
			onUpdate: 'cascade'
		})
	},
	(table) => {
		return {
			uniqueIndex: uniqueIndex('idx_articles_unique_user_slug').on(table.slug, table.user_id)
		};
	}
);
