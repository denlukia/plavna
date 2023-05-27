import { supportedLanguages } from '$lib/i18n/languages';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return (supportedLanguages as readonly string[]).includes(param);
}) satisfies ParamMatcher;
