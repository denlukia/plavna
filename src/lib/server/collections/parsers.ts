import { createAtLeastOnePropBeyondTheseIsNonEmptyChecker as atLeastOnePropBeyond } from '../utils/objects';
import {
	images,
	pages,
	articles,
	previewTemplates,
	sections,
	sectionsToTags,
	tags,
	tagsToArticles,
	translations
} from './db-schema';
import { ERRORS } from './errors';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { previewFamiliesIds } from './previews';

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
const translationRefineArgs = [
	atLeastOnePropBeyond(['user_id', 'key']),
	{ message: ERRORS.AT_LEAST_ONE_TRANSLATION }
] as const;
const translationInsertBaseSchema = createInsertSchema(translations);

export const translationSelectSchema = createSelectSchema(translations);
export const translationInsertSchema = translationInsertBaseSchema
	.omit({ user_id: true })
	.refine(...translationRefineArgs);
export const translationUpdateSchema = createInsertSchema(translations)
	.omit({ user_id: true })
	.required({ key: true })
	.refine(...translationRefineArgs);
export const translationDeleteSchema = translationSelectSchema.pick({ key: true });

// Articles
export const articleSelectSchema = createSelectSchema(articles, {
	preview_family: z.enum(previewFamiliesIds)
});
export const articleInsertSchema = createInsertSchema(articles, {
	preview_family: z.enum(previewFamiliesIds)
});

export const articleSlugUpdateSchema = articleSelectSchema.pick({ slug: true });

const previewRelatedFields = {
	preview_family: true,
	preview_template_id: true,
	preview_prop_1_value: true,
	preview_prop_2_value: true,
	preview_prop_3_value: true
} as const;
export const articlePreviewUpdateSchema = articleInsertSchema.pick(previewRelatedFields);
export const articleSelectWithoutPreviewValuesSchema =
	articleSelectSchema.omit(previewRelatedFields);

// Preview Templates
export const previewTemplateSelectSchema = createSelectSchema(previewTemplates);
export const previewTemplateInsertSchema = createInsertSchema(previewTemplates);

// TODO Refine url
export const previewTemplateCreationFormSchema = previewTemplateInsertSchema
	.pick({ url: true })
	.merge(translationInsertBaseSchema)
	.omit({ key: true, user_id: true })
	.refine(...translationRefineArgs);
export const previewTemplateEditingFormSchema = previewTemplateSelectSchema
	.pick({ url: true })
	.extend({ template_id: previewTemplateSelectSchema.shape.id })
	.merge(translationInsertBaseSchema)
	.omit({ user_id: true })
	.refine(...translationRefineArgs);
export const previewTemplateDeletionFormSchema = previewTemplateSelectSchema.pick({ id: true });

// Images
export const imageSelectSchema = createSelectSchema(images);

// Excluded Tags Config
export const excludedTags = z.record(
	sectionSelectSchema.shape.id,
	z.array(tagSelectSchema.shape.id)
);
