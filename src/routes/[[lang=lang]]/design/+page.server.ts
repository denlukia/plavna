import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { translationInsertSchema } from '$lib/features/i18n/parsers';

import type { PageServerLoad } from './$types';

export const load = (async () => {
	const translationFormData = await superValidate({ en: 'Test' }, zod(translationInsertSchema));

	return {
		translationFormData
	};
}) satisfies PageServerLoad;

export const actions = {
	update_translation: async () => {
		// It's a mock action
	}
};
