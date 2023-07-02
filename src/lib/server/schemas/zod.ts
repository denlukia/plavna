import { pages, posts, sections, tags, translations } from './db';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Pages
export const pageSelectSchema = createSelectSchema(pages);
export const pageInsertSchema = createInsertSchema(pages);
export const pageFormSchema = pageInsertSchema.omit({ user_id: true });

// Sections
export const sectionSelectSchema = createSelectSchema(sections);
export const sectionInsertSchema = createInsertSchema(sections);

// Tags
export const tagSelectSchema = createSelectSchema(tags);
export const tagInsertSchema = createInsertSchema(tags);
export const tagUpdateSchema = tagInsertSchema
	.pick({ id: true })
	.required({ id: true })
	.extend({ checked: z.boolean() });
export const tagDeleteSchema = tagSelectSchema.pick({ id: true });

// Translations
export const translationSelectSchema = createSelectSchema(translations);
export const translationInsertSchema = createInsertSchema(translations).omit({ user_id: true });
export const translationUpdateSchema = translationInsertSchema.required({ _id: true });

// Posts
export const postSelectSchema = createSelectSchema(posts);
export const postInsertSchema = createInsertSchema(posts);
export const postUpdateSchema = postInsertSchema
	.pick({ id: true, slug: true })
	.required({ id: true, slug: true });

// Reader Page Config
export const readerPageConfigSchema = z.record(
	sectionSelectSchema.shape.id,
	z.array(tagSelectSchema.shape.id)
);
