import type { ServerImageHandler } from '@denlukia/plavna-common/images';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
	SLUG_ALLOWED_CHARS_REGEX,
	SLUG_MAX_LENGTH,
	SLUG_MIN_LENGTH
} from '$lib/collections/config';

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
	.min(SLUG_MIN_LENGTH, {
		message: checkTranslationKey('actor_errors.min_length')
	})
	.max(SLUG_MAX_LENGTH, {
		message: checkTranslationKey('actor_errors.max_length')
	})
	.regex(SLUG_ALLOWED_CHARS_REGEX, {
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
