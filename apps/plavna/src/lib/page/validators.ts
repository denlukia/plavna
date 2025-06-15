import { defaultThemeSet } from '@plavna/design/theming/basics';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { getBasicSlugValidator } from '../common/validators';
import { sectionSelectSchema } from '../section/validators';
import { tagSelectSchema } from '../tag/validators';
import { table_pages } from './schema';

const pageSlugValidator = getBasicSlugValidator('page');

// Validators
export const pageSelectSchema = createSelectSchema(table_pages);
export const pageInsertSchema = createInsertSchema(table_pages);

// Form Validators
export const pageCreationFormSchema = pageInsertSchema.omit({ user_id: true }).extend({
	slug: pageSlugValidator,
	color_theme: pageSelectSchema.shape.color_theme.default(defaultThemeSet.color),
	style_theme: pageSelectSchema.shape.style_theme.default(defaultThemeSet.style),
	typography_interface_theme: pageSelectSchema.shape.typography_interface_theme.default(
		defaultThemeSet.typographyInterface
	),
	typography_markdown_theme: pageSelectSchema.shape.typography_markdown_theme.default(
		defaultThemeSet.typographyMarkdown
	)
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
