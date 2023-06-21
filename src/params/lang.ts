import { type SupportedLang, supportedLanguages } from '$lib/client-server/languages';

import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return supportedLanguages.includes(param as SupportedLang);
}) satisfies ParamMatcher;
