import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { checkTranslationKey } from '../i18n/utils';
import { pages } from './schemas';

// Parsers
export const pageSelectSchema = createSelectSchema(pages);
export const pageInsertSchema = createInsertSchema(pages);

// Form Parsers
export const pageCreationFormSchema = pageInsertSchema.omit({ user_id: true }).extend({
	slug: pageSelectSchema.shape.slug //
		.max(15, {
			message: checkTranslationKey('user_pages.errors.max_length')
		})
		.regex(/^[a-z0-9-]*$/i, {
			message: checkTranslationKey('user_pages.errors.disallowed_chars')
		})
});
export const pageUpdatingFormSchema = pageCreationFormSchema.required({ id: true });
// СПРОСТИТИ ДО ВІДСИЛАННЯ ПРОСТИХ КЛЮЧІВ
export const pageDeletionFormSchema = pageSelectSchema.pick({ id: true });

// Types
export type PageCreationForm = z.infer<typeof pageCreationFormSchema>; // Pages

export type PageSelect = z.infer<typeof pageSelectSchema>;
export type PageInsert = z.infer<typeof pageInsertSchema>;
export type PageCreateForm = z.infer<typeof pageCreationFormSchema>;
export type PageCreateFormZod = typeof pageCreationFormSchema;
export type PageUpdateForm = z.infer<typeof pageUpdatingFormSchema>;
export type PageUpdateFormZod = typeof pageUpdatingFormSchema;
export type PageDeletionForm = z.infer<typeof pageDeletionFormSchema>;
export type PageDeletionFormZod = typeof pageDeletionFormSchema;
