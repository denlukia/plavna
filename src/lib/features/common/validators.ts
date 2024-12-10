import { supportedLangs } from '@denlukia/plavna-common/constants';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import { z } from 'zod';
import {
	SLUG_ALLOWED_CHARS_REGEX,
	SLUG_MAX_LENGTH,
	SLUG_MIN_LENGTH
} from '$lib/collections/config';
import { reservedPrefixes, reservedWords } from '$lib/collections/reserved-words';

import { checkTranslationKey } from '../i18n/utils';

function createSuffixedField<N extends string, S extends string, V>(
	name: N,
	suffix: S,
	validator: V
) {
	const key = `${name}.${suffix}` as `${N}.${S}`;
	return { [key]: validator } as Record<typeof key, typeof validator>;
}
export function generateLanguagedFields<N extends string, V>(name: N, validator: V) {
	return supportedLangs.reduce(
		(acc, lang) => ({ ...acc, ...createSuffixedField(name, lang, validator) }),
		{} as ReturnType<typeof createSuffixedField<typeof name, SupportedLang, V>>
	);
}

export const baseSlugValidator = z
	.string() //
	.min(SLUG_MIN_LENGTH, {
		message: checkTranslationKey('actor_errors.min_length')
	})
	.max(SLUG_MAX_LENGTH, {
		message: checkTranslationKey('actor_errors.max_length')
	})
	.regex(SLUG_ALLOWED_CHARS_REGEX, {
		message: checkTranslationKey('actor_errors.disallowed_chars')
	})
	.refine((str) => !reservedWords.includes(str), {
		message: checkTranslationKey('actor_errors.reserved_word')
	})
	.refine((str) => reservedPrefixes.every((prefix) => !str.startsWith(prefix)), {
		message: checkTranslationKey('actor_errors.reserved_prefix')
	});
