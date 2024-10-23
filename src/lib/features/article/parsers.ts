import type { ServerImageHandler } from '@denlukia/plavna-common/images';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { checkTranslationKey } from '../i18n/utils';
import { previewFamiliesIds } from '../preview/families';
import type {
	articlePreviewImageFileFieldsAllObj,
	articlePreviewImageIdsFieldsSchema,
	articlePreviewUpdateSchema
} from '../preview/parsers';
import { articles } from './schema';

const slugParser = z
	.string() //
	.min(3, {
		message: checkTranslationKey('article_editor.errors.min_length')
	})
	.max(15, {
		message: checkTranslationKey('article_editor.errors.max_length')
	})
	.regex(/^[a-z0-9-]*$/i, {
		message: checkTranslationKey('article_editor.errors.disallowed_chars')
	});

export const articleSelectSchema = createSelectSchema(articles, {
	preview_family: z.enum(previewFamiliesIds)
});
export const articleInsertSchema = createInsertSchema(articles, {
	preview_family: z.enum(previewFamiliesIds),
	slug: slugParser
});
export const articleSlugUpdateSchema = articleSelectSchema.pick({ slug: true }).extend({
	slug: slugParser
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
