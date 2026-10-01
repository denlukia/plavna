import { z } from 'zod';
import { checkTranslationKey } from '$lib/i18n/utils';

export const mdImportFormSchema = z.object({
	url: z
		.string()
		.trim()
		.min(1, { message: checkTranslationKey('actor_errors.invalid_url') })
		.refine(
			(url) => {
				try {
					const parsed = new URL(url);
					return parsed.protocol === 'http:' || parsed.protocol === 'https:';
				} catch {
					return false;
				}
			},
			{ message: checkTranslationKey('actor_errors.invalid_url') }
		),
	heading_shift: z.coerce.number().int().min(-3).max(3)
});

export type MdImportForm = z.infer<typeof mdImportFormSchema>;
export type MdImportFormZod = typeof mdImportFormSchema;
