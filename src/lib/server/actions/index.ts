import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { translationUpdateSchema } from '../collections/parsers';
import { detokenizeEmptyStrings, removeNullValues, tokenizeEmptyStrings } from '../helpers/objects';

export async function update_translation(event: RequestEvent) {
	const formData = await event.request.formData();
	const tokenizedFormData = tokenizeEmptyStrings(formData);

	const form = await superValidate(tokenizedFormData, zod(translationUpdateSchema));
	if (!form.valid) return fail(400, { form });

	const detokenizedData = detokenizeEmptyStrings(form.data);
	const onlyNonNull = removeNullValues(detokenizedData);

	const { plavna } = event.locals;
	await plavna.translations.update(onlyNonNull);
}
