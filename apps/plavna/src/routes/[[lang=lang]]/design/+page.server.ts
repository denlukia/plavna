import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { translationInsertSchema } from '$lib/i18n/validators';

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
