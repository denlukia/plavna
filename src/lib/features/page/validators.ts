import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { baseSlugValidator } from '../common/validators';
import { sectionSelectSchema } from '../section/validators';
import { tagSelectSchema } from '../tag/validators';
import { table_pages } from './schema';

const pageSlugValidator = baseSlugValidator.or(z.literal(''));

// Validators
export const pageSelectSchema = createSelectSchema(table_pages);
export const pageInsertSchema = createInsertSchema(table_pages);

// Form Validators
export const pageCreationFormSchema = pageInsertSchema.omit({ user_id: true }).extend({
	slug: pageSlugValidator
});
export const pageUpdatingFormSchema = pageCreationFormSchema.required({ id: true });
export const pageDeletionFormSchema = pageSelectSchema.pick({ id: true }); // TODO: Maybe simplify to simple key type?

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

// Reader's Page Config
export const readerPageConfig = z.record(
	sectionSelectSchema.shape.id,
	z.object({
		excludedTags: z.array(tagSelectSchema.shape.id)
	})
);
export type ReaderPageConfig = z.infer<typeof readerPageConfig>;
