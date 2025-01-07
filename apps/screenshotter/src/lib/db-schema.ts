import {
	type ScreenshotsQueueInsert,
	type ScreenshotsQueueSelect,
	createScreenshotsQueueSchema
} from '@denlukia/plavna-common/queue';
import { type TypeEqualityGuard, assert } from '@denlukia/plavna-common/types';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

const supportedLangs = ['en', 'uk'] as const;

export const imagesMock = sqliteTable('images', {
	id: integer('id').primaryKey({ autoIncrement: true })
});
export const screenshotsQueue = createScreenshotsQueueSchema(supportedLangs, imagesMock);

export type ScreenshotsQueueSelectLocal = typeof screenshotsQueue.$inferSelect;
export type ScreenshotsQueueInsertLocal = typeof screenshotsQueue.$inferInsert;

// These will error if screenshots table schema
// (it's is common for this and main projects)
// is different from defined in plavna-common package.
// Update types in package and update main project if needed
assert<TypeEqualityGuard<ScreenshotsQueueSelectLocal, ScreenshotsQueueSelect>>();
assert<TypeEqualityGuard<ScreenshotsQueueInsertLocal, ScreenshotsQueueInsert>>();
