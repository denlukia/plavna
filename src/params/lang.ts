import { type SupportedLang, isSupportedLang, supportedLanguages } from '$lib/isomorphic/languages';

import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return isSupportedLang(param);
}) satisfies ParamMatcher;
