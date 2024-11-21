import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { table_tags, table_tagsToArticles } from './schema';

// Parsers
export const tagSelectSchema = createSelectSchema(table_tags);
export const tagInsertSchema = createInsertSchema(table_tags);
export const tagUpdateSchema = tagInsertSchema
	.pick({ id: true })
	.required({ id: true })
	.extend({ checked: z.boolean() });
export const tagDeleteSchema = tagSelectSchema.pick({ id: true });

export const tagToArticleSelectSchema = createSelectSchema(table_tagsToArticles); // Tags

// Types
export type TagSelect = z.infer<typeof tagSelectSchema>;
export type TagInsert = z.infer<typeof tagInsertSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;
export type TagDelete = z.infer<typeof tagDeleteSchema>;

export type TagToArticleSelect = z.infer<typeof tagToArticleSelectSchema>;
