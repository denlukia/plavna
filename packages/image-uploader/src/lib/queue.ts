import { sql } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ImageProviderRelatedActorData } from './images/types';

// Just to reference types and declare foreign key in queue schema creator
export const imageMock = sqliteTable('images', {
	id: integer('id').primaryKey({ autoIncrement: true })
});

export function createScreenshotsQueueSchema(
	langsEnum: readonly [string, ...string[]],
	images: typeof imageMock
) {
	return sqliteTable('screenshots_queue', {
		id: integer('id').primaryKey({ autoIncrement: true }),
		image_id: integer('image_id')
			.notNull()
			.references(() => images.id),
		width: integer('width').notNull(),
		height: integer('height').notNull(),
		url: text('url').notNull(),
		lang: text('lang', { enum: langsEnum }),
		queued_at: integer('queued_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(strftime('%s', 'now'))`),
		processing_attempts: integer('processing_attempts').notNull().default(0),
		processing_running: integer('processing_running', { mode: 'boolean' }).notNull().default(false),
		imageProviderData: blob('image_provider_data', { mode: 'json' })
			.notNull()
			.$type<ImageProviderRelatedActorData>()
	});
}

export type ScreenshotsQueueSelect = ReturnType<
	typeof createScreenshotsQueueSchema
>['$inferSelect'];
export type ScreenshotsQueueInsert = ReturnType<
	typeof createScreenshotsQueueSchema
>['$inferInsert'];
