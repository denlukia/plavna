import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from '$lib/features/auth/schema';

import { translations } from '../i18n/schema';
import { images } from '../image/schema';
import { previewFamiliesIds } from '../preview/families';
import { previewTemplates } from '../preview/schema';
import { dynamicPreviewActivationConditions } from '../preview/types';
import { tagsToArticles } from '../tag/schema';

export const articles = sqliteTable(
	'articles',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull(),
		title_translation_key: integer('title_translation_key')
			.notNull()
			.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
		content_translation_key: integer('content_translation_key')
			.notNull()
			.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
		publish_time: integer('publish_time', { mode: 'timestamp' }),
		likes_count: integer('likes_count').notNull().default(0),
		preview_columns: integer('preview_columns').notNull().default(1),
		preview_rows: integer('preview_rows').notNull().default(1),
		preview_family: text('preview_family', { enum: previewFamiliesIds }),
		preview_template_id: integer('preview_template_id').references(() => previewTemplates.id, {
			onDelete: 'set null',
			onUpdate: 'cascade'
		}),
		preview_interactions_show_on: text('preview_interactions_show_on', {
			enum: dynamicPreviewActivationConditions
		}).default('hover'),
		preview_prop_1: text('preview_prop_1'),
		preview_prop_2: text('preview_prop_2'),
		preview_translation_1_key: integer('preview_translation_1_key')
			.notNull()
			.references(() => translations.key, { onDelete: 'set null', onUpdate: 'cascade' }),
		preview_translation_2_key: integer('preview_translation_2_key')
			.notNull()
			.references(() => translations.key, { onDelete: 'set null', onUpdate: 'cascade' }),
		preview_image_1_id: integer('preview_image_1_id')
			.notNull()
			.references(() => images.id, {
				onDelete: 'set null',
				onUpdate: 'cascade'
			}),
		preview_image_2_id: integer('preview_image_2_id')
			.notNull()
			.references(() => images.id, {
				onDelete: 'set null',
				onUpdate: 'cascade'
			}),
		preview_create_localized_screenshots: integer('preview_create_localized_screenshots', {
			mode: 'boolean'
		})
			.notNull()
			.default(false),
		preview_screenshot_image_id: integer('preview_screenshot_image_id').references(
			() => images.id,
			{
				onDelete: 'set null',
				onUpdate: 'cascade'
			}
		)
	},
	(table) => {
		return {
			uniqueIndex: uniqueIndex('idx_articles_unique_user_slug').on(table.slug, table.user_id)
		};
	}
);

export const articlesRelations = relations(articles, ({ one, many }) => ({
	title_translation: one(translations, {
		fields: [articles.title_translation_key],
		references: [translations.key]
	}),
	content_translation: one(translations, {
		fields: [articles.content_translation_key],
		references: [translations.key]
	}),
	tagsArticles: many(tagsToArticles)
}));
