import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { createAtLeastOnePropBeyondTheseIsNonEmptyChecker as atLeastOnePropBeyond } from '$lib/features/common/utils';

import { translations } from './schema';
import { checkTranslationKey } from './utils';

// Translations

export const atLeastOneTranslationRefiner = [
	atLeastOnePropBeyond(['user_id', 'key']),
	{ message: checkTranslationKey('actor_errors.at_least_one_translation') }
] as const;
export const translationInsertBaseSchema = createInsertSchema(translations);

export const translationSelectSchema = createSelectSchema(translations);
export const translationInsertSchema = translationInsertBaseSchema
	.omit({ user_id: true })
	.refine(...atLeastOneTranslationRefiner);
export const translationUpdateSchema = createInsertSchema(translations)
	.omit({ user_id: true })
	.required({ key: true })
	.refine(...atLeastOneTranslationRefiner);
export const translationDeleteSchema = translationSelectSchema.pick({ key: true }); // Translations

export type TranslationSelect = z.infer<typeof translationSelectSchema>;
export type TranslationSelectZod = typeof translationSelectSchema;
export type TranslationInsertBase = z.infer<typeof translationInsertBaseSchema>;
export type TranslationInsert = z.infer<typeof translationInsertSchema>;
export type TranslationInsertZod = typeof translationInsertSchema;
export type TranslationUpdate = z.infer<typeof translationUpdateSchema>;
export type TranslationUpdateZod = typeof translationUpdateSchema;
export type TranslationDelete = z.infer<typeof translationDeleteSchema>;
