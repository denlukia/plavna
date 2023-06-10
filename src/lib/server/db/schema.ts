import { type InferModel, relations } from 'drizzle-orm';
import {
	type SQLiteTextBuilderInitial,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';

import type { SupportedLang } from '$lib/common/languages';

export const user = sqliteTable(
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
export type User = InferModel<typeof user, 'select'>;

export const session = sqliteTable('auth_session', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	active_expires: integer('active_expires').notNull(),
	idle_expires: integer('idle_expires').notNull()
});

export const key = sqliteTable('auth_key', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	primary_key: integer('primary_key').notNull(),
	hashed_password: text('hashed_password'),
	expires: integer('expires')
});

export const userpage = sqliteTable(
	'page',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id),
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

export const translation = sqliteTable('translation', {
	// underscore cause "id" is Indonasian lang code
	_id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	...langs
});

export const section = sqliteTable('section', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id')
		.notNull()
		.references(() => userpage.id),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	title_translation_id: integer('title_translation')
		.notNull()
		.references(() => translation._id)
});

export const sectionTag = sqliteTable(
	'section_tag',
	{
		section_id: integer('section_id')
			.notNull()
			.references(() => section.id),
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tag.id)
	},
	(table) => {
		return {
			pk: primaryKey(table.section_id, table.tag_id)
		};
	}
);

export const tag = sqliteTable('tag', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name_translation_id: integer('name_translation')
		.notNull()
		.references(() => translation._id)
});

export const tagPost = sqliteTable(
	'tag_post',
	{
		tag_id: integer('tag_id')
			.notNull()
			.references(() => tag.id),
		post_id: integer('post_id')
			.notNull()
			.references(() => post.id)
	},
	(table) => {
		return {
			pk: primaryKey(table.tag_id, table.post_id)
		};
	}
);

export const post = sqliteTable(
	'post',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id),
		slug: text('slug').notNull(),
		title_translation_id: integer('title_translation')
			.notNull()
			.references(() => translation._id),
		published_at: integer('published_at', { mode: 'timestamp' })
	},
	(table) => {
		return {
			uniqueIndex: uniqueIndex('idx_post_unique_user_slug').on(table.slug, table.user_id)
		};
	}
);
export type PostInsert = InferModel<typeof post, 'insert'>;

export const postRelations = relations(post, ({ one }) => ({
	title_translation: one(translation, {
		fields: [post.title_translation_id],
		references: [translation._id]
	})
}));
