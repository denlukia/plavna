import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import type { SupportedLang } from '$lib/isomorphic/languages';

export const users = sqliteTable(
	'auth_user',
	{
		id: text('id').primaryKey(),
		username: text('username').notNull(),
		imagekit_public_key: text('imagekit_public_key'),
		imagekit_private_key: text('imagekit_private_key'),
		imagekit_url_endpoint: text('imagekit_url_endpoint')
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_user_unique_username').on(table.username)
		};
	}
);

export const sessions = sqliteTable('auth_session', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	active_expires: integer('active_expires').notNull(),
	idle_expires: integer('idle_expires').notNull()
});

export const keys = sqliteTable('auth_key', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	hashed_password: text('hashed_password')
});

export const pages = sqliteTable(
	'pages',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull()
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_pages_unique_user_slug').on(table.user_id, table.slug)
		};
	}
);

export const pagesRelations = relations(pages, ({ many }) => ({
	sections: many(sections)
}));

export const sections = sqliteTable('sections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id')
		.notNull()
		.references(() => pages.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	title_translation_id: integer('title_translation_id')
		.notNull()
		.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const sectionsRelations = relations(sections, ({ one, many }) => ({
	page: one(pages, {
		fields: [sections.page_id],
		references: [pages.id]
	}),
	title_translation: one(translations, {
		fields: [sections.title_translation_id],
		references: [translations.key]
	}),
	sectionsToTags: many(sectionsToTags)
}));

export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_id: integer('name_translation_id')
		.notNull()
		.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
	name_translation: one(translations, {
		fields: [tags.name_translation_id],
		references: [translations.key]
	}),
	sectionsToTags: many(sectionsToTags),
	tagsToArticles: many(tagsToArticles)
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
		lang: text('lang').$type<SupportedLang>().notNull()
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

export const articles = sqliteTable(
	'articles',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull(),
		title_translation_id: integer('title_translation_id')
			.notNull()
			.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
		content_translation_id: integer('content_translation_id')
			.notNull()
			.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
		published_at: integer('published_at', { mode: 'timestamp' }),
		preview_type_id: integer('preview_type_id').references(() => previewTypes.id, {
			onDelete: 'set null',
			onUpdate: 'set null'
		}),
		preview_interactions_show_on: text('preview_interactions_show_on').$type<'hover' | 'click'>(),
		preview_prop_1_value: text('preview_prop_1_value'),
		preview_prop_2_value: text('preview_prop_2_value'),
		preview_prop_3_value: text('preview_prop_3_value')
	},
	(table) => {
		return {
			uniqueIndex: uniqueIndex('idx_articles_unique_user_slug').on(table.slug, table.user_id)
		};
	}
);

export const articlesRelations = relations(articles, ({ one, many }) => ({
	title_translation: one(translations, {
		fields: [articles.title_translation_id],
		references: [translations.key]
	}),
	content_translation: one(translations, {
		fields: [articles.content_translation_id],
		references: [translations.key]
	}),
	tagsArticles: many(tagsToArticles)
}));

export const tagsToArticles = sqliteTable(
	'tags_to_articles',
	{
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		article_id: integer('article_id')
			.notNull()
			.references(() => articles.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			pk: primaryKey(table.tag_id, table.article_id)
		};
	}
);

export const tagsToArticlesRelations = relations(tagsToArticles, ({ one }) => ({
	tags: one(tags, {
		fields: [tagsToArticles.tag_id],
		references: [tags.id]
	}),
	articles: one(articles, {
		fields: [tagsToArticles.article_id],
		references: [articles.id]
	})
}));

export const previewTypes = sqliteTable('preview_types', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_id: integer('name_translation_id')
		.notNull()
		.references(() => translations.key, { onDelete: 'cascade', onUpdate: 'cascade' }),
	image_id: integer('image_id').references(() => images.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	url: text('url').notNull()
});

export const images = sqliteTable('images', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	source: text('source').$type<'uploadcare'>().notNull(),
	reference: text('reference').notNull(),
	reference_translation_id: integer('reference_translation_id').references(() => translations.key, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});

export const translations = sqliteTable('translations', {
	// It's "key" because is "id" is Indonasian lang code
	key: integer('key').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	en: text('en'),
	uk: text('uk')
});
