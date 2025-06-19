import {
	createScreenshotsQueueSchema,
	supportedLangs,
	type ScreenshotsQueueInsert,
	type ScreenshotsQueueSelect
} from '@plavna/common';
import { assert, type TypeEqualityGuard } from '@plavna/image-uploader/types';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

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
