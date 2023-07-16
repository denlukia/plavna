import { createAtLeastOnePropBeyondTheseIsNonEmptyChecker } from '../utils/objects';
import { images, pages, posts, previewTypes, sections, tags, translations } from './db';
import { ERRORS } from './errors';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// TODO Refine all slug schemas to accept only valid slugs

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
export const translationInsertSchema = createInsertSchema(translations);
export const translationUpdateSchema = translationInsertSchema
	.omit({ user_id: true })
	.required({ _id: true });

export const translationInsertNonEmptySchema = translationSelectSchema
	.omit({
		user_id: true,
		_id: true
	})
	.refine(createAtLeastOnePropBeyondTheseIsNonEmptyChecker(['user_id', '_id']), {
		message: ERRORS.AT_LEAST_ONE_TRANSLATION
	});

// Posts
export const postSelectSchema = createSelectSchema(posts);
export const postInsertSchema = createInsertSchema(posts);
export const postUpdateSchema = postInsertSchema
	.pick({ id: true, slug: true })
	.required({ id: true, slug: true });

export const postPreviewValuesUpdateSchema = postInsertSchema.pick({
	preview_prop_1_value: true,
	preview_prop_2_value: true,
	preview_prop_3_value: true
});

// Preview Types
export const previewTypeSelectSchema = createSelectSchema(previewTypes);
export const previewTypeInsertSchema = createInsertSchema(previewTypes);

// Images
export const imageSelectSchema = createSelectSchema(images);

// Reader Page Config
export const readerPageConfigSchema = z.record(
	sectionSelectSchema.shape.id,
	z.array(tagSelectSchema.shape.id)
);
