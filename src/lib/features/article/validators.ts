import type { ServerImageHandler } from '@denlukia/plavna-common/images';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { checkTranslationKey } from '../i18n/utils';
import { previewFamiliesIds } from '../preview/families';
import type {
	articlePreviewImageFileFieldsAllObj,
	articlePreviewImageIdsFieldsSchema,
	articlePreviewUpdateSchema
} from '../preview/validators';
import { table_articles } from './schema';

const slugValidator = z
	.string() //
	.min(3, {
		message: checkTranslationKey('actor_errors.min_length_3')
	})
	.max(15, {
		message: checkTranslationKey('actor_errors.max_length_15')
	})
	.regex(/^[a-z0-9-]*$/i, {
		message: checkTranslationKey('actor_errors.disallowed_chars')
	});

export const articleSelectSchema = createSelectSchema(table_articles, {
	preview_family: z.enum(previewFamiliesIds)
});
export const articleInsertSchema = createInsertSchema(table_articles, {
	preview_family: z.enum(previewFamiliesIds),
	slug: slugValidator
});
export const articleSlugUpdateSchema = articleSelectSchema.pick({ slug: true }).extend({
	slug: slugValidator
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
