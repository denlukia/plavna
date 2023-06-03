import type { InferModel } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('auth_user', {
	id: text('id').primaryKey(),
	username: text('username').notNull()
});
export type User = InferModel<typeof user, 'select'>;
export type InsertUser = InferModel<typeof user, 'insert'>;

export const session = sqliteTable('auth_session', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	active_expires: integer('active_expires').notNull(),
	idle_expires: integer('idle_expires').notNull()
});
export type Session = InferModel<typeof session, 'select'>;
export type InsertSession = InferModel<typeof session, 'insert'>;

export const key = sqliteTable('auth_key', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	primary_key: integer('primary_key').notNull(),
	hashed_password: text('hashed_password'),
	expires: integer('expires')
});
export type Key = InferModel<typeof key, 'select'>;
export type InsertKey = InferModel<typeof key, 'insert'>;

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
export type Page = InferModel<typeof userpage, 'select'>;
export type InsertPage = InferModel<typeof userpage, 'insert'>;

export const section = sqliteTable('section', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id')
		.notNull()
		.references(() => userpage.id),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	title: text('title').notNull()
});
export type Section = InferModel<typeof section, 'select'>;
export type InsertSection = InferModel<typeof section, 'insert'>;
