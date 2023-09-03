import { createAtLeastOnePropBeyondTheseIsNonEmptyChecker } from '../utils/objects';
import {
	images,
	pages,
	articles,
	previewTypes,
	sections,
	sectionsToTags,
	tags,
	tagsToArticles,
	translations
} from './db-schema';
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
export const sectionUpdateSchema = createSelectSchema(translations).omit({ user_id: true }).extend({
	section_id: sectionSelectSchema.shape.id
});
export const sectionDeleteSchema = sectionSelectSchema.pick({ id: true });

// Sections to Tags
export const sectionToTagSelectSchema = createSelectSchema(sectionsToTags);
export const sectionToTagInsertSchema = createInsertSchema(sectionsToTags);

// Tags
export const tagSelectSchema = createSelectSchema(tags);
export const tagInsertSchema = createInsertSchema(tags);
export const tagUpdateSchema = tagInsertSchema
	.pick({ id: true })
	.required({ id: true })
	.extend({ checked: z.boolean() });
export const tagDeleteSchema = tagSelectSchema.pick({ id: true });

// Tags to Articles
export const tagToArticleSelectSchema = createSelectSchema(tagsToArticles);

// Translations
export const translationSelectSchema = createSelectSchema(translations);
export const translationInsertSchema = createInsertSchema(translations).refine(
	createAtLeastOnePropBeyondTheseIsNonEmptyChecker(['user_id', 'key']),
	{
		message: ERRORS.AT_LEAST_ONE_TRANSLATION
	}
);
export const translationUpdateSchema = createInsertSchema(translations)
	.omit({ user_id: true })
	.required({ key: true })
	.refine(createAtLeastOnePropBeyondTheseIsNonEmptyChecker(['user_id', 'key']), {
		message: ERRORS.AT_LEAST_ONE_TRANSLATION
	});
export const translationDeleteSchema = translationSelectSchema.pick({ key: true });

// Articles
export const articleSelectSchema = createSelectSchema(articles);
export const articleInsertSchema = createInsertSchema(articles);
export const articleUpdateSchema = z.object({});
export const articleSlugUpdateSchema = articleSelectSchema.pick({ slug: true });
export const articlePreviewUpdateSchema = articleInsertSchema.pick({
	preview_type_id: true,
	preview_prop_1_value: true,
	preview_prop_2_value: true,
	preview_prop_3_value: true
});
export const articleSelectWithoutPreviewValuesSchema = articleSelectSchema.omit({
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
