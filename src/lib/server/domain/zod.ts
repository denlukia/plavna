import { createAtLeastOnePropBeyondTheseIsNonEmptyChecker } from '../utils/objects';
import {
	images,
	pages,
	posts,
	previewTypes,
	sections,
	sectionsTags,
	tags,
	translations
} from './db';
import { ERRORS } from './errors';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// TODO Refine all slug schemas to accept only valid slugs

// Pages
export const pageSelectSchema = createSelectSchema(pages);
export const pageInsertSchema = createInsertSchema(pages);
export const pageCreateFormSchema = pageInsertSchema.omit({ user_id: true });
export const pageUpdateFormSchema = pageCreateFormSchema.required({ id: true });

// Sections
export const sectionSelectSchema = createSelectSchema(sections);
export const sectionInsertSchema = createInsertSchema(sections);
export const sectionUpdateSchema = createSelectSchema(translations).extend({
	section_id: sectionSelectSchema.shape.id
});

// Sections to Tags
export const sectionTagSelectSchema = createSelectSchema(sectionsTags);
export const sectionTagInsertSchema = createInsertSchema(sectionsTags);

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
export const translationInsertSchema = createInsertSchema(translations).refine(
	createAtLeastOnePropBeyondTheseIsNonEmptyChecker(['user_id', '_id']),
	{
		message: ERRORS.AT_LEAST_ONE_TRANSLATION
	}
);
export const translationUpdateSchema = createInsertSchema(translations)
	.omit({ user_id: true })
	.required({ _id: true })
	.refine(createAtLeastOnePropBeyondTheseIsNonEmptyChecker(['user_id', '_id']), {
		message: ERRORS.AT_LEAST_ONE_TRANSLATION
	});

// Posts
export const postSelectSchema = createSelectSchema(posts);
export const postInsertSchema = createInsertSchema(posts);
export const postUpdateSchema = z.object({});
export const postSlugUpdateSchema = postSelectSchema.pick({ slug: true });
export const postPreviewUpdateSchema = postInsertSchema.pick({
	preview_type_id: true,
	preview_prop_1_value: true,
	preview_prop_2_value: true,
	preview_prop_3_value: true
});
export const postSelectWithoutPreviewValuesSchema = postSelectSchema.omit({
	preview_type_id: true,
	preview_prop_1_value: true,
	preview_prop_2_value: true,
	preview_prop_3_value: true
});

// Preview Types
export const previewTypeSelectSchema = createSelectSchema(previewTypes);
export const previewTypeInsertSchema = createInsertSchema(previewTypes);

// Images
export const imageSelectSchema = createSelectSchema(images);

// Excluded Tags Config
export const excludedTags = z.record(
	sectionSelectSchema.shape.id,
	z.array(tagSelectSchema.shape.id)
);
