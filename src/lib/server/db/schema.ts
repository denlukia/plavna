import { supportedLanguages, type SupportedLang } from '$lib/common/languages';
import type { InferModel } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, primaryKey } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('auth_user', {
	id: text('id').primaryKey(),
	username: text('username').notNull()
});
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
		return { slugIndex: uniqueIndex('idx_unique_user_slug').on(table.user_id, table.slug) };
	}
);

const langs: {
	[key in SupportedLang]: any;
} = {
	en: text('en'),
	uk: text('uk')
};

export const translation = sqliteTable('translation', {
	id: integer('id').primaryKey({ autoIncrement: true }),
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
	titleTranslation: integer('title_translation').references(() => translation.id)
});

export const sectionTag = sqliteTable(
	'section_tag',
	{
		section_id: integer('section_id').references(() => section.id),
		tag_id: integer('tag_id').references(() => tag.id)
	},
	(table) => {
		return {
			pk: primaryKey(table.section_id, table.tag_id)
		};
	}
);

export const tag = sqliteTable('tag', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nameTranslation: integer('name_translation').references(() => translation.id)
});

export const tagPost = sqliteTable(
	'tag_post',
	{
		tag_id: integer('tag_id').references(() => tag.id),
		post_id: integer('post_id').references(() => post.id)
	},
	(table) => {
		return {
			pk: primaryKey(table.tag_id, table.post_id)
		};
	}
);

export const post = sqliteTable('post', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull(),
	titleTranslation: integer('title_translation').references(() => translation.id)
});
