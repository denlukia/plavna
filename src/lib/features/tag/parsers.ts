import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { tags, tagsToArticles } from './schema';

// Parsers
export const tagSelectSchema = createSelectSchema(tags);
export const tagInsertSchema = createInsertSchema(tags);
export const tagUpdateSchema = tagInsertSchema
	.pick({ id: true })
	.required({ id: true })
	.extend({ checked: z.boolean() });
export const tagDeleteSchema = tagSelectSchema.pick({ id: true });

export const tagToArticleSelectSchema = createSelectSchema(tagsToArticles); // Tags

// Types
export type TagSelect = z.infer<typeof tagSelectSchema>;
export type TagInsert = z.infer<typeof tagInsertSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;
export type TagDelete = z.infer<typeof tagDeleteSchema>;

export type TagToArticleSelect = z.infer<typeof tagToArticleSelectSchema>;
