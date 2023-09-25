import type { auth } from '../services/auth';
import type { users } from './db-schema';
import type {
	articleInsertSchema,
	articlePreviewScreenshotMeta,
	articlePreviewUpdateSchema,
	articleSelectSchema,
	articleSlugUpdateSchema,
	excludedTags,
	imageInsertSchema,
	imageProviderUpdateFormSchema,
	imageSelectSchema,
	imageUpdateSchema,
	pageCreateFormSchema,
	pageInsertSchema,
	pageSelectSchema,
	pageUpdateFormSchema,
	previewTemplateCreationFormSchema,
	previewTemplateDeletionFormSchema,
	previewTemplateEditingFormSchema,
	previewTemplateSelectSchema,
	sectionDeleteSchema,
	sectionInsertSchema,
	sectionSelectSchema,
	sectionToTagInsertSchema,
	sectionToTagSelectSchema,
	sectionUpdateSchema,
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
import type { MaybePromise } from 'Instance';
import type { z } from 'zod';

// Auth
export type Auth = typeof auth;

// Users
export type User = typeof users.$inferSelect;
export type ImageProviderUpdateZod = typeof imageProviderUpdateFormSchema;
export type ImageProdiverUpdate = z.infer<typeof imageProviderUpdateFormSchema>;

// Pages
export type PageSelect = z.infer<typeof pageSelectSchema>;
export type PageInsert = z.infer<typeof pageInsertSchema>;
export type PageCreateForm = z.infer<typeof pageCreateFormSchema>;
export type PageCreateFormZod = typeof pageCreateFormSchema;
export type PageUpdateForm = z.infer<typeof pageUpdateFormSchema>;
export type PageUpdateFormZod = typeof pageUpdateFormSchema;

// Sections
export type SectionSelect = z.infer<typeof sectionSelectSchema>;
export type SectionInsert = z.infer<typeof sectionInsertSchema>;
export type SectionUpdate = z.infer<typeof sectionUpdateSchema>;
export type SectionDelete = z.infer<typeof sectionDeleteSchema>;

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

// Article Preview Screenshotting
export type ArticlePreviewScreenshotMeta = z.infer<typeof articlePreviewScreenshotMeta>;

// Preview Templates
export type PreviewTemplateSelect = z.infer<typeof previewTemplateSelectSchema>;
export type PreviewTemplateCreationFormZod = typeof previewTemplateCreationFormSchema;
export type PreviewTemplateEditingFormZod = typeof previewTemplateEditingFormSchema;
export type PreviewTemplateDeletionFormZod = typeof previewTemplateDeletionFormSchema;
export type PreviewTemplateCreation = z.infer<typeof previewTemplateCreationFormSchema>;
export type PreviewTemplateEditing = z.infer<typeof previewTemplateEditingFormSchema>;
export type PreviewTemplateDeletion = z.infer<typeof previewTemplateDeletionFormSchema>;

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

// Excluded Tags Config
export type ExcludedTags = z.infer<typeof excludedTags>;
