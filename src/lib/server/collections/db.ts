import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import type { SupportedLang } from '$lib/isomorphic/languages';

export const users = sqliteTable(
	'auth_user',
	{
		id: text('id').primaryKey(),
		username: text('username').notNull(),
		uploadcare_token: text('uploadcare_token')
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
	'page',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull()
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_userpage_unique_user_slug').on(table.user_id, table.slug)
		};
	}
);

export const pagesRelations = relations(pages, ({ many }) => ({
	sections: many(sections)
}));

export const sections = sqliteTable('section', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id')
		.notNull()
		.references(() => pages.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	title_translation_id: integer('title_translation_id')
		.notNull()
		.references(() => translations._id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const sectionsRelations = relations(sections, ({ one, many }) => ({
	page: one(pages, {
		fields: [sections.page_id],
		references: [pages.id]
	}),
	title_translation: one(translations, {
		fields: [sections.title_translation_id],
		references: [translations._id]
	}),
	sectionsTags: many(sectionsTags)
}));

export const tags = sqliteTable('tag', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_id: integer('name_translation_id')
		.notNull()
		.references(() => translations._id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
	name_translation: one(translations, {
		fields: [tags.name_translation_id],
		references: [translations._id]
	}),
	sectionsTags: many(sectionsTags),
	tagsPosts: many(tagsPosts)
}));

export const sectionsTags = sqliteTable(
	'section_tag',
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

export const sectionsTagsRelations = relations(sectionsTags, ({ one }) => ({
	section: one(sections, {
		fields: [sectionsTags.section_id],
		references: [sections.id]
	}),
	tag: one(tags, {
		fields: [sectionsTags.tag_id],
		references: [tags.id]
	})
}));

export const posts = sqliteTable(
	'post',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		slug: text('slug').notNull(),
		title_translation_id: integer('title_translation_id')
			.notNull()
			.references(() => translations._id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		content_translation_id: integer('content_translation_id')
			.notNull()
			.references(() => translations._id, { onDelete: 'cascade', onUpdate: 'cascade' }),
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
			uniqueIndex: uniqueIndex('idx_post_unique_user_slug').on(table.slug, table.user_id)
		};
	}
);

export const postsRelations = relations(posts, ({ one, many }) => ({
	title_translation: one(translations, {
		fields: [posts.title_translation_id],
		references: [translations._id]
	}),
	content_translation: one(translations, {
		fields: [posts.content_translation_id],
		references: [translations._id]
	}),
	tagsPosts: many(tagsPosts)
}));

export const tagsPosts = sqliteTable(
	'tag_post',
	{
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		post_id: integer('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			pk: primaryKey(table.tag_id, table.post_id)
		};
	}
);

export const tagsPostsRelations = relations(tagsPosts, ({ one }) => ({
	tags: one(tags, {
		fields: [tagsPosts.tag_id],
		references: [tags.id]
	}),
	posts: one(posts, {
		fields: [tagsPosts.post_id],
		references: [posts.id]
	})
}));

export const previewTypes = sqliteTable('preview_type', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	name_translation_id: integer('name_translation_id')
		.notNull()
		.references(() => translations._id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	info_image_id: integer('info_image_id').references(() => images.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	url: text('url').notNull()
});

export const images = sqliteTable('image', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	source: text('source').$type<'uploadcare'>().notNull(),
	reference: text('reference').notNull(),
	reference_translation_id: integer('reference_translation_id').references(() => translations._id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});

export const translations = sqliteTable('translation', {
	// _id cause "id" is Indonasian lang code
	_id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	en: text('en'),
	uk: text('uk')
});
