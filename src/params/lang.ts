import { type SupportedLang, supportedLanguages } from '$lib/isomorphic/languages';

import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return supportedLanguages.includes(param as SupportedLang);
}) satisfies ParamMatcher;
