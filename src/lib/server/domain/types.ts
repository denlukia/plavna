import type { auth } from '../services/auth';
import type { users } from './db';
import type {
	excludedTags,
	imageSelectSchema,
	pageCreateFormSchema,
	pageInsertSchema,
	pageSelectSchema,
	pageUpdateFormSchema,
	postInsertSchema,
	postPreviewUpdateSchema,
	postSelectSchema,
	postSelectWithoutPreviewValuesSchema,
	postSlugUpdateSchema,
	previewTypeSelectSchema,
	sectionDeleteSchema,
	sectionInsertSchema,
	sectionSelectSchema,
	sectionTagInsertSchema,
	sectionTagSelectSchema,
	sectionUpdateSchema,
	tagDeleteSchema,
	tagInsertSchema,
	tagPostSelectSchema,
	tagSelectSchema,
	tagUpdateSchema,
	translationDeleteSchema,
	translationInsertSchema,
	translationSelectSchema,
	translationUpdateSchema
} from './parsers';
import type { InferModel } from 'drizzle-orm';
import type { z } from 'zod';

// Auth
export type Auth = typeof auth;

// Users
export type User = InferModel<typeof users, 'select'>;

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
export type SectionTagSelect = z.infer<typeof sectionTagSelectSchema>;
export type SectionTagInsert = z.infer<typeof sectionTagInsertSchema>;

// Tags
export type TagSelect = z.infer<typeof tagSelectSchema>;
export type TagInsert = z.infer<typeof tagInsertSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;
export type TagUpdateZod = typeof tagUpdateSchema;
export type TagDelete = z.infer<typeof tagDeleteSchema>;
export type TagDeleteZod = typeof tagDeleteSchema;

// Tags to Posts
export type TagPostSelect = z.infer<typeof tagPostSelectSchema>;

// Translations
export type TranslationSelect = z.infer<typeof translationSelectSchema>;
export type TranslationInsert = z.infer<typeof translationInsertSchema>;
export type TranslationInsertZod = typeof translationInsertSchema;
export type TranslationUpdate = z.infer<typeof translationUpdateSchema>;
export type TranslationUpdateZod = typeof translationUpdateSchema;
export type TranslationDelete = z.infer<typeof translationDeleteSchema>;

// Posts
export type PostSelect = z.infer<typeof postSelectSchema>;
export type PostInsert = z.infer<typeof postInsertSchema>;
export type PostSlugUpdate = z.infer<typeof postSlugUpdateSchema>;
export type PostPreviewUpdate = z.infer<typeof postPreviewUpdateSchema>;
export type PostPreviewUpdateZod = typeof postPreviewUpdateSchema;
export type PostSelectWithoutPreviewValues = z.infer<typeof postSelectWithoutPreviewValuesSchema>;

// Previews
export type PreviewTypeSelect = z.infer<typeof previewTypeSelectSchema>;

// Images
export type ImageSelect = z.infer<typeof imageSelectSchema>;

// Excluded Tags Config
export type ExcludedTags = z.infer<typeof excludedTags>;
