import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod, type ZodObjectTypes, type ZodValidation } from 'sveltekit-superforms/adapters';

import { detokenizeEmptyStrings, removeNullValues, tokenizeEmptyStrings } from '../common/utils';
import { replaceEmptyWithNull } from './utils';

export function createTranslationUpdater(schema: ZodValidation<ZodObjectTypes>) {
	return async (event: RequestEvent) => {
		const formData = await event.request.formData();
		const tokenizedFormData = tokenizeEmptyStrings(formData);

		const form = await superValidate(tokenizedFormData, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const detokenizedData = detokenizeEmptyStrings(form.data);
		form.data = detokenizedData;
		const onlyNonNull = removeNullValues(detokenizedData);
		const emptyAreNull = replaceEmptyWithNull(onlyNonNull);

		const { translationService } = event.locals;
		await translationService.update(emptyAreNull);

		return { form };
	};
}
