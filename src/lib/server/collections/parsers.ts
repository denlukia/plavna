import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { supportedLangs } from '$lib/isomorphic/languages';

import { ERRORS } from '../../isomorphic/errors';
import { createAtLeastOnePropBeyondTheseIsNonEmptyChecker as atLeastOnePropBeyond } from '../utils/objects';
import {
	articles,
	images,
	pages,
	previewTemplates,
	sections,
	sectionsToTags,
	tags,
	tagsToArticles,
	translations,
	users
} from './db-schema';
import { previewFamiliesIds } from './previews';

// TODO Refine all slug schemas to accept only valid slugs

export const imageProviderUpdateFormSchema = createSelectSchema(users).pick({
	imagekit_private_key: true,
	imagekit_public_key: true,
	imagekit_url_endpoint: true
});
// TODO Refine url

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
export const translationInsertBaseSchema = createInsertSchema(translations);

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
	preview_prop_1: true,
	preview_prop_2: true,
	preview_create_localized_screenshots: true
} as const;
export const articlePreviewUpdateSchema = articleInsertSchema.pick(previewRelatedFields);

// Article Preview Screenshotting
export const articlePreviewScreenshotMeta = z.object({
	article_id: articleSelectSchema.shape.id,
	lang: z.enum(supportedLangs).optional()
});
export const articlePreviewScreenshotParams = z
	.object({
		width: z.number(),
		height: z.number(),
		lang: z.enum(supportedLangs)
	})
	.merge(articleSelectSchema.pick({ preview_prop_1: true, preview_prop_2: true }))
	.extend({
		preview_translation_1: z.string(),
		preview_translation_2: z.string(),
		preview_image_1: z.string(),
		preview_image_2: z.string()
	});
export const articlePreviewCellsTaken = articleSelectSchema.pick({
	preview_columns: true,
	preview_rows: true
});

// Preview Templates
export const previewTemplateSelectSchema = createSelectSchema(previewTemplates);
export const previewTemplateInsertSchema = createInsertSchema(previewTemplates);

// TODO Refine url
const fakeImageFieldExtender = { image: z.optional(z.string()) };
export const previewTemplateCreationFormSchema = previewTemplateInsertSchema
	.pick({ url: true })
	.extend(fakeImageFieldExtender)
	.merge(translationInsertBaseSchema)
	.omit({ key: true, user_id: true })
	.refine(...translationRefineArgs);
export const previewTemplateEditingFormSchema = previewTemplateSelectSchema
	.pick({ url: true })
	.extend({ template_id: previewTemplateSelectSchema.shape.id, ...fakeImageFieldExtender })
	.merge(translationInsertBaseSchema)
	.omit({ user_id: true })
	.refine(...translationRefineArgs);
export const previewTemplateDeletionFormSchema = previewTemplateSelectSchema.pick({ id: true });

// Images
export const imageSelectSchema = createSelectSchema(images);
export const imageInsertSchema = createInsertSchema(images);
export const imageUpdateSchema = imageInsertSchema.partial().required({
	id: true
});

// Excluded Tags Config
export const excludedTags = z.record(
	sectionSelectSchema.shape.id,
	z.array(tagSelectSchema.shape.id)
);
