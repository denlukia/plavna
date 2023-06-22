import { type InferModel, relations } from 'drizzle-orm';
import {
	type SQLiteTextBuilderInitial,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';

import type { SupportedLang } from '$lib/isomorphic/languages';

export const users = sqliteTable(
	'auth_user',
	{
		id: text('id').primaryKey(),
		username: text('username').notNull()
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_user_unique_username').on(table.username)
		};
	}
);
export type User = InferModel<typeof users, 'select'>;

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
	primary_key: integer('primary_key').notNull(),
	hashed_password: text('hashed_password'),
	expires: integer('expires')
});

export const pages = sqliteTable(
	'page',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id),
		slug: text('slug').notNull()
	},
	(table) => {
		return {
			slugIndex: uniqueIndex('idx_userpage_unique_user_slug').on(table.user_id, table.slug)
		};
	}
);

const langs: Record<SupportedLang, SQLiteTextBuilderInitial<string, [string, ...string[]]>> = {
	en: text('en'),
	uk: text('uk')
};

export const translations = sqliteTable('translation', {
	// underscore cause "id" is Indonasian lang code
	_id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	...langs
});
export type TranslationSelect = InferModel<typeof translations, 'select'>;
export type TranslationInsert = InferModel<typeof translations, 'insert'>;

export const sections = sqliteTable('section', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id')
		.notNull()
		.references(() => pages.id),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	title_translation_id: integer('title_translation')
		.notNull()
		.references(() => translations._id)
});

export const sectionsTags = sqliteTable(
	'section_tag',
	{
		section_id: integer('section_id')
			.notNull()
			.references(() => sections.id),
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tags.id)
	},
	(table) => {
		return {
			pk: primaryKey(table.section_id, table.tag_id)
		};
	}
);

export const tags = sqliteTable('tag', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name_translation_id: integer('name_translation')
		.notNull()
		.references(() => translations._id)
});

export const tagsPosts = sqliteTable(
	'tag_post',
	{
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tags.id),
		post_id: integer('post_id')
			.notNull()
			.references(() => posts.id)
	},
	(table) => {
		return {
			pk: primaryKey(table.tag_id, table.post_id)
		};
	}
);

export const posts = sqliteTable(
	'post',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id),
		slug: text('slug').notNull(),
		title_translation_id: integer('title_translation')
			.notNull()
			.references(() => translations._id),
		published_at: integer('published_at', { mode: 'timestamp' })
	},
	(table) => {
		return {
			uniqueIndex: uniqueIndex('idx_post_unique_user_slug').on(table.slug, table.user_id)
		};
	}
);

export const postsRelations = relations(posts, ({ one }) => ({
	title_translation: one(translations, {
		fields: [posts.title_translation_id],
		references: [translations._id]
	})
}));
