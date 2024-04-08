import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { checkTranslationKey } from '../common/translations/_index';
import { pages } from './schema';

// Schemas
export const pageSelectSchema = createSelectSchema(pages);
export const pageInsertSchema = createInsertSchema(pages);

// Form Schemas
export const pageCreateFormSchema = pageInsertSchema.omit({ user_id: true }).extend({
	slug: pageSelectSchema.shape.slug //
		.max(15, {
			message: checkTranslationKey('user_pages.errors.max_length')
		})
		.regex(/^[a-z0-9-]*$/i, {
			message: checkTranslationKey('user_pages.errors.disallowed_chars')
		})
});
export const pageUpdateFormSchema = pageCreateFormSchema.required({ id: true });
