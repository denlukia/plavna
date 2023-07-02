import type { auth } from '../services/auth';
import type { users } from './db';
import type {
	pageFormSchema,
	pageInsertSchema,
	pageSelectSchema,
	postInsertSchema,
	postSelectSchema,
	postUpdateSchema,
	readerPageConfigSchema,
	sectionInsertSchema,
	sectionSelectSchema,
	tagDeleteSchema,
	tagInsertSchema,
	tagSelectSchema,
	tagUpdateSchema,
	translationInsertSchema,
	translationSelectSchema,
	translationUpdateSchema
} from './zod';
import type { InferModel } from 'drizzle-orm';
import type { z } from 'zod';

// Auth
export type Auth = typeof auth;

// Users
export type User = InferModel<typeof users, 'select'>;

// Pages
export type PageSelect = z.infer<typeof pageSelectSchema>;
export type PageInsert = z.infer<typeof pageInsertSchema>;
export type PageForm = z.infer<typeof pageFormSchema>;

// Sections
export type SectionSelect = z.infer<typeof sectionSelectSchema>;
export type SectionInsert = z.infer<typeof sectionInsertSchema>;

// Tags
export type TagSelect = z.infer<typeof tagSelectSchema>;
export type TagInsert = z.infer<typeof tagInsertSchema>;
export type TagUpdate = z.infer<typeof tagUpdateSchema>;
export type TagUpdateZod = typeof tagUpdateSchema;
export type TagDelete = z.infer<typeof tagDeleteSchema>;
export type TagDeleteZod = typeof tagDeleteSchema;

// Translations
export type TranslationSelect = z.infer<typeof translationSelectSchema>;
export type TranslationInsert = z.infer<typeof translationInsertSchema>;
export type TranslationInsertZod = typeof translationInsertSchema;
export type TranslationUpdate = z.infer<typeof translationUpdateSchema>;
export type TranslationUpdateZod = typeof translationUpdateSchema;

// Posts
export type PostSelect = z.infer<typeof postSelectSchema>;
export type PostInsert = z.infer<typeof postInsertSchema>;
export type PostUpdate = z.infer<typeof postUpdateSchema>;

// Reader Page Config
export type ReaderPageConfig = z.infer<typeof readerPageConfigSchema>;
