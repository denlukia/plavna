import { setError, type SuperValidated } from 'sveltekit-superforms';

import { checkTranslationKey } from '../i18n/utils';
import { ErrorWithTranslation } from './ErrorWithTranslation';

export function getActionFailure(
	error: unknown | ErrorWithTranslation,
	form: SuperValidated<Record<string, unknown>>,
	field: string
) {
	const message =
		error instanceof ErrorWithTranslation
			? error.translationKey
			: checkTranslationKey('actor_errors.unknown_error');

	return setError(form, field, message);
}
