import { supportedLangs } from '@plavna/image-uploader/constants';
import type { ScreenshotsQueueInsert, ScreenshotsQueueSelect } from '@plavna/image-uploader/queue';
import { assert, type TypeEqualityGuard } from '@plavna/image-uploader/types';
import { z } from 'zod';

import { articleSelectSchema } from '../article/validators';
import { table_screenshotsQueue } from './schema';

// Article Preview Screenshotting
export const articlePreviewScreenshotMeta = z.object({
	article_id: articleSelectSchema.shape.id,
	lang: z.enum(supportedLangs).optional()
});
export const articlePreviewScreenshotParams = z
	.object({
		width: z.number(),
		height: z.number(),
		lang: z.enum(supportedLangs)
	})
	.merge(
		articleSelectSchema.pick({
			preview_prop_1: true,
			preview_prop_2: true,
			preview_prop_3: true,
			preview_prop_4: true
		})
	)
	.extend({
		preview_translation_1: z.string(),
		preview_translation_2: z.string(),
		preview_image_1: z.string(),
		preview_image_2: z.string()
	});
export const articlePreviewCellsTaken = articleSelectSchema.pick({
	preview_columns: true,
	preview_rows: true
});

export type ArticlePreviewScreenshotMeta = z.infer<typeof articlePreviewScreenshotMeta>;
export type ArticlePreviewScreenshotQuery = z.infer<typeof articlePreviewScreenshotParams>;
export type ArticlePreviewCellsTaken = z.infer<typeof articlePreviewCellsTaken>;

// Screenshots Queue
export type ScreenshotsQueueSelectLocal = typeof table_screenshotsQueue.$inferSelect;
export type ScreenshotsQueueInsertLocal = typeof table_screenshotsQueue.$inferInsert;
// These will error if screenshots table schema
// (it's is common for this and screenshotter projects)
// is different from defined in plavna-common package.
// Update types in package and update screenshotter if needed
assert<TypeEqualityGuard<ScreenshotsQueueSelectLocal, ScreenshotsQueueSelect>>();
assert<TypeEqualityGuard<ScreenshotsQueueInsertLocal, ScreenshotsQueueInsert>>();
