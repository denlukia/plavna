import type { MaybePromise } from '@sveltejs/kit';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Component } from 'svelte';
import { z } from 'zod';

import { articleInsertSchema, type articleSelectSchema } from '../article/validators';
import { generateLanguagedFields } from '../common/validators';
import { atLeastOneTranslationRefiner, translationInsertBaseSchema } from '../i18n/validators';
import { imageFileField } from '../image/validators';
import type { PreviewFamilyId } from './families/types';
import { table_previewTemplates } from './schema';

// Previews
const previewRelatedFields: Partial<Record<keyof z.infer<typeof articleSelectSchema>, true>> = {
	preview_family: true,
	preview_template_id: true,
	preview_prop_1: true,
	preview_prop_2: true,
	preview_create_localized_screenshots: true,
	preview_columns: true,
	preview_rows: true
};
export const articlePreviewImageIdsFieldsSchema = articleInsertSchema.pick({
	preview_image_1_id: true,
	preview_image_2_id: true
});
export const articlePreviewImageFileFieldsAllObj = {
	preview_image_1: imageFileField,
	preview_image_2: imageFileField,
	delete_preview_image_1: z.boolean().optional(),
	delete_preview_image_2: z.boolean().optional(),
	...generateLanguagedFields('preview_image_1', imageFileField),
	...generateLanguagedFields('preview_image_2', imageFileField),
	...generateLanguagedFields('delete_preview_image_1', z.boolean().optional()),
	...generateLanguagedFields('delete_preview_image_2', z.boolean().optional())
};

export const articlePreviewUpdateSchema = articleInsertSchema
	.pick(previewRelatedFields)
	// .merge(articlePreviewImageIdsFieldsSchema)
	.extend(articlePreviewImageFileFieldsAllObj);

// Preview Templates
export const previewTemplateImageFieldsSchema = z.object({
	image: imageFileField,
	delete_image: z.boolean().optional()
});
export const previewTemplateSelectSchema = createSelectSchema(table_previewTemplates);
export const previewTemplateInsertSchema = createInsertSchema(table_previewTemplates);
export const previewTemplateCreationFormSchema = previewTemplateInsertSchema
	.pick({ url: true })
	.merge(previewTemplateImageFieldsSchema)
	.merge(translationInsertBaseSchema)
	.omit({ key: true, user_id: true })
	.refine(...atLeastOneTranslationRefiner);
export const previewTemplateEditingFormSchema = previewTemplateSelectSchema
	.pick({ url: true })
	.extend({ template_id: previewTemplateSelectSchema.shape.id })
	.merge(previewTemplateImageFieldsSchema)
	.merge(translationInsertBaseSchema)
	.omit({ user_id: true })
	.refine(...atLeastOneTranslationRefiner);
export const previewTemplateDeletionFormSchema = previewTemplateSelectSchema.pick({ id: true });

export type PreviewTemplateSelect = z.infer<typeof previewTemplateSelectSchema>;
export type PreviewTemplateCreationForm = z.infer<typeof previewTemplateCreationFormSchema>;
export type PreviewTemplateEditingForm = z.infer<typeof previewTemplateEditingFormSchema>;
export type PreviewTemplateDeletionForm = z.infer<typeof previewTemplateDeletionFormSchema>;
export type PreviewTemplateCreation = z.infer<typeof previewTemplateCreationFormSchema>;
export type PreviewTemplateEditing = z.infer<typeof previewTemplateEditingFormSchema>;
export type PreviewTemplateDeletion = z.infer<typeof previewTemplateDeletionFormSchema>;
export type PreviewTemplateImageFields = z.infer<typeof previewTemplateImageFieldsSchema>;
export type PreviewTemplateImageFieldsZod = typeof previewTemplateImageFieldsSchema;

export type PreviewComponents = Record<
	PreviewFamilyId,
	{
		editor?: MaybePromise<Component | null>;
		static?: Component;
		dynamic?: Component;
	}
>;
