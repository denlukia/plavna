import type { ScreenshotsQueueInsert, ScreenshotsQueueSelect } from '@denlukia/plavna-common/queue';
import type { ServerImageHandler } from '@denlukia/plavna-common/server';
import { assert } from '@denlukia/plavna-common/types';
import type { TypeEqualityGuard } from '@denlukia/plavna-common/types';
import type { SuperValidated } from 'sveltekit-superforms';
import type { z } from 'zod';

import type { screenshotsQueue } from './db-schema';
import type {
	articleInsertSchema,
	articlePreviewCellsTaken,
	articlePreviewImageFileFieldsAllObj,
	articlePreviewImageIdsFieldsSchema,
	articlePreviewScreenshotMeta,
	articlePreviewScreenshotParams,
	articlePreviewUpdateSchema,
	articleSelectSchema,
	articleSlugUpdateSchema,
	excludedTags,
	imageCreationFormSchema,
	imageInsertSchema,
	imageSelectSchema,
	imageUpdateFileFields,
	imageUpdateFormSchema,
	imageUpdateSchema,
	previewTemplateCreationFormSchema,
	previewTemplateDeletionFormSchema,
	previewTemplateEditingFormSchema,
	previewTemplateImageFieldsSchema,
	previewTemplateSelectSchema,
	sectionToTagInsertSchema,
	sectionToTagSelectSchema,
	tagDeleteSchema,
	tagInsertSchema,
	tagSelectSchema,
	tagToArticleSelectSchema,
	tagUpdateSchema,
	translationDeleteSchema,
	translationInsertBaseSchema,
	translationInsertSchema,
	translationSelectSchema,
	translationUpdateSchema
} from './parsers';
import type { PreviewFamilyId } from './previews';

// Sections to Tags
export type SectionToTagSelect = z.infer<typeof sectionToTagSelectSchema>;
export type SectionToTagInsert = z.infer<typeof sectionToTagInsertSchema>;

// Tags
export type TagSelect = z.infer<typeof tagSelectSchema>;
export type TagInsert = z.infer<typeof tagInsertSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;
export type TagUpdateZod = typeof tagUpdateSchema;
export type TagDelete = z.infer<typeof tagDeleteSchema>;
export type TagDeleteZod = typeof tagDeleteSchema;

// Tags to Articles
export type TagToArticleSelect = z.infer<typeof tagToArticleSelectSchema>;

// Translations
export type TranslationSelect = z.infer<typeof translationSelectSchema>;
export type TranslationSelectZod = typeof translationSelectSchema;
export type TranslationInsertBase = z.infer<typeof translationInsertBaseSchema>;
export type TranslationInsert = z.infer<typeof translationInsertSchema>;
export type TranslationInsertZod = typeof translationInsertSchema;
export type TranslationUpdate = z.infer<typeof translationUpdateSchema>;
export type TranslationUpdateZod = typeof translationUpdateSchema;
export type TranslationDelete = z.infer<typeof translationDeleteSchema>;

// Articles
export type ArticleSelect = z.infer<typeof articleSelectSchema>;
export type ArticleInsert = z.infer<typeof articleInsertSchema>;
export type ArticleSlugUpdate = z.infer<typeof articleSlugUpdateSchema>;
export type ArticlePreviewUpdate = z.infer<typeof articlePreviewUpdateSchema>;
export type ArticlePreviewUpdateZod = typeof articlePreviewUpdateSchema;

export type ArticlePreviewImageIdsFields = z.infer<typeof articlePreviewImageIdsFieldsSchema>;
export type ArticlePreviewImageFileFieldsAll = typeof articlePreviewImageFileFieldsAllObj;
export type ArticlePreviewImageFileFieldNamesAll = keyof ArticlePreviewImageFileFieldsAll;
export type ArticlePreviewImageHandlers = Record<
	ArticlePreviewImageFileFieldNamesAll,
	ServerImageHandler
>;

// Article Preview Screenshotting
export type ArticlePreviewScreenshotMeta = z.infer<typeof articlePreviewScreenshotMeta>;
export type ArticlePreviewScreenshotQuery = z.infer<typeof articlePreviewScreenshotParams>;
export type ArticlePreviewCellsTaken = z.infer<typeof articlePreviewCellsTaken>;

// Preview Templates
export type PreviewTemplateSelect = z.infer<typeof previewTemplateSelectSchema>;
export type PreviewTemplateCreationFormZod = typeof previewTemplateCreationFormSchema;
export type PreviewTemplateEditingFormZod = typeof previewTemplateEditingFormSchema;
export type PreviewTemplateDeletionFormZod = typeof previewTemplateDeletionFormSchema;
export type PreviewTemplateCreation = z.infer<typeof previewTemplateCreationFormSchema>;
export type PreviewTemplateEditing = z.infer<typeof previewTemplateEditingFormSchema>;
export type PreviewTemplateDeletion = z.infer<typeof previewTemplateDeletionFormSchema>;
export type PreviewTemplateImageFields = z.infer<typeof previewTemplateImageFieldsSchema>;
export type PreviewTemplateImageFieldsZod = typeof previewTemplateImageFieldsSchema;

// Preview Components
export type PreviewComponents = Record<
	PreviewFamilyId,
	{
		editor?:
			| ConstructorOfATypedSvelteComponent
			| Promise<ConstructorOfATypedSvelteComponent | Error>
			| Error;
		static?: ConstructorOfATypedSvelteComponent;
		dynamic?: ConstructorOfATypedSvelteComponent;
	}
>;

// Images
export type ImageSelect = z.infer<typeof imageSelectSchema>;
export type ImageInsert = z.infer<typeof imageInsertSchema>;
export type ImageUpdate = z.infer<typeof imageUpdateSchema>;
export type ImageUpdateForm = z.infer<typeof imageUpdateFormSchema>;
export type ImageUpdateFormZod = typeof imageUpdateFormSchema;
export type ImageCollectionItem = {
	form: SuperValidated<ImageUpdateForm>;
	meta: ImageSelect;
};
export type ImageUpdateFileFields = typeof imageUpdateFileFields;
export type ImageCreationForm = z.infer<typeof imageCreationFormSchema>;
export type ImagesCollection = {
	creation: SuperValidated<ImageCreationForm>;
	items: ImageCollectionItem[];
};
export type ImageUpdateImageHandlers = Record<keyof ImageUpdateFileFields, ServerImageHandler>;

// Excluded Tags Config
export type ExcludedTags = z.infer<typeof excludedTags>;

// Screenshots Queue
export type ScreenshotsQueueSelectLocal = typeof screenshotsQueue.$inferSelect;
export type ScreenshotsQueueInsertLocal = typeof screenshotsQueue.$inferInsert;

// These will error if screenshots table schema
// (it's is common for this and screenshotter projects)
// is different from defined in plavna-common package.
// Update types in package and update screenshotter if needed
assert<TypeEqualityGuard<ScreenshotsQueueSelectLocal, ScreenshotsQueueSelect>>();
assert<TypeEqualityGuard<ScreenshotsQueueInsertLocal, ScreenshotsQueueInsert>>();
