import type {
	pageFormSchema,
	pageInsertSchema,
	pageSelectSchema,
	postFormFlatSchema,
	postFormNestedSchema,
	postInsertSchema,
	postSelectSchema,
	readerPageConfigSchema,
	sectionInsertSchema,
	sectionSelectSchema,
	tagInsertSchema,
	tagSelectSchema,
	translationInsertSchema,
	translationSelectSchema,
	translationStringSchema
} from './zod';
import type { z } from 'zod';

// Pages
export type PageInsert = z.infer<typeof pageInsertSchema>;
export type PageSelect = z.infer<typeof pageSelectSchema>;

export type PageForm = z.infer<typeof pageFormSchema>;

// Sections
export type SectionInsert = z.infer<typeof sectionInsertSchema>;
export type SectionSelect = z.infer<typeof sectionSelectSchema>;

// Tags
export type TagInsert = z.infer<typeof tagInsertSchema>;
export type TagSelect = z.infer<typeof tagSelectSchema>;

// Translations
export type TranslationInsert = z.infer<typeof translationInsertSchema>;
export type TranslationSelect = z.infer<typeof translationSelectSchema>;

export type TranslationString = z.infer<typeof translationStringSchema>;

// Posts
export type PostInsert = z.infer<typeof postInsertSchema>;
export type PostSelect = z.infer<typeof postSelectSchema>;

export type PostFormNested = z.infer<typeof postFormNestedSchema>;
export type PostFormFlat = z.infer<typeof postFormFlatSchema>;

// Reader Page Config
export type ReaderPageConfig = z.infer<typeof readerPageConfigSchema>;
