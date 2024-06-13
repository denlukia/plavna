import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { detokenizeEmptyStrings, removeNullValues, tokenizeEmptyStrings } from '../common/utils';
import { translationUpdateSchema } from './parsers';

export async function update_translation(event: RequestEvent) {
	const formData = await event.request.formData();
	const tokenizedFormData = tokenizeEmptyStrings(formData);

	const form = await superValidate(tokenizedFormData, zod(translationUpdateSchema));
	if (!form.valid) {
		fail(400, { form });
	}

	const detokenizedData = detokenizeEmptyStrings(form.data);
	const onlyNonNull = removeNullValues(detokenizedData);

	const { translationService } = event.locals;
	await translationService.update(onlyNonNull);

	return { form };
}
