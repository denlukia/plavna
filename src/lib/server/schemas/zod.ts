import { addPrefixDotToKeys } from '../utils/objects';
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

// Translations
export const translationSelectSchema = createSelectSchema(translations);
export const translationInsertSchema = createInsertSchema(translations);

export const translationStringSchema = z.string().optional();
export const translationBaseObj = {
	_id: translationSelectSchema.shape._id,
	en: translationStringSchema,
	uk: translationStringSchema
};

// Posts
export const postSelectSchema = createSelectSchema(posts);
export const postInsertSchema = createInsertSchema(posts);

export const postFormNestedSchema = postInsertSchema
	.omit({ title_translation_id: true, user_id: true })
	.extend({
		title_translation: z.object({
			...translationBaseObj
		})
	});
export const postFormFlatSchema = postInsertSchema
	.omit({ title_translation_id: true, user_id: true })
	.extend({
		...addPrefixDotToKeys(translationBaseObj, 'title_translation')
	});

// Reader Page Config
export const readerPageConfigSchema = z.record(
	sectionSelectSchema.shape.id,
	z.array(tagSelectSchema.shape.id)
);
