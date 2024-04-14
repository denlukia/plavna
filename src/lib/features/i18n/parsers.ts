import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { ERRORS } from '$lib/collections/errors';
import { createAtLeastOnePropBeyondTheseIsNonEmptyChecker as atLeastOnePropBeyond } from '$lib/features/common/utils';

import { translations } from './schema';

// Translations

export const translationRefineArgs = [
	atLeastOnePropBeyond(['user_id', 'key']),
	{ message: ERRORS.AT_LEAST_ONE_TRANSLATION }
] as const;
export const translationInsertBaseSchema = createInsertSchema(translations);

export const translationSelectSchema = createSelectSchema(translations);
export const translationInsertSchema = translationInsertBaseSchema
	.omit({ user_id: true })
	.refine(...translationRefineArgs);
export const translationUpdateSchema = createInsertSchema(translations)
	.omit({ user_id: true })
	.required({ key: true })
	.refine(...translationRefineArgs);
export const translationDeleteSchema = translationSelectSchema.pick({ key: true }); // Translations

export type TranslationSelect = z.infer<typeof translationSelectSchema>;
export type TranslationSelectZod = typeof translationSelectSchema;
export type TranslationInsertBase = z.infer<typeof translationInsertBaseSchema>;
export type TranslationInsert = z.infer<typeof translationInsertSchema>;
export type TranslationInsertZod = typeof translationInsertSchema;
export type TranslationUpdate = z.infer<typeof translationUpdateSchema>;
export type TranslationUpdateZod = typeof translationUpdateSchema;
export type TranslationDelete = z.infer<typeof translationDeleteSchema>;
