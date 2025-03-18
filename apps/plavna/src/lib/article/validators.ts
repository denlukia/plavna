import type { ServerImageHandlerVercelEdge } from '@plavna/image-uploader/images';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { getBasicSlugValidator } from '../common/validators';
import { previewFamiliesIds } from '../preview/families';
import type {
	articlePreviewImageFileFieldsAllObj,
	articlePreviewImageIdsFieldsSchema,
	articlePreviewUpdateSchema
} from '../preview/validators';
import { table_articles } from './schema';

export const articleSelectSchema = createSelectSchema(table_articles, {
	preview_family: z.enum(previewFamiliesIds)
});
export const articleInsertSchema = createInsertSchema(table_articles, {
	preview_family: z.enum(previewFamiliesIds),
	slug: getBasicSlugValidator('article')
});
export const articleSlugUpdateSchema = articleSelectSchema.pick({ slug: true }).extend({
	slug: getBasicSlugValidator('article')
});

export type ArticleSelect = z.infer<typeof articleSelectSchema>;
export type ArticleInsert = z.infer<typeof articleInsertSchema>;
export type ArticleSlugUpdate = z.infer<typeof articleSlugUpdateSchema>;
export type ArticlePreviewUpdate = z.infer<typeof articlePreviewUpdateSchema>;
export type ArticlePreviewUpdateZod = typeof articlePreviewUpdateSchema;

export type ArticlePreviewImageIdsFields = z.infer<typeof articlePreviewImageIdsFieldsSchema>;
export type ArticlePreviewImageFileFieldsAll = typeof articlePreviewImageFileFieldsAllObj;
export type ArticlePreviewImageFileFieldNamesAll = keyof ArticlePreviewImageFileFieldsAll;
export type ArticlePreviewImageHandlers = Record<
	ArticlePreviewImageFileFieldNamesAll,
	ServerImageHandler | null
>;
