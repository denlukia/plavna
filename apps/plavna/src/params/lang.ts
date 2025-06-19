import type { SupportedLang } from '@plavna/common';
import type { ParamMatcher } from '@sveltejs/kit';
import { isSupportedLang } from '$lib/i18n/utils';

export const match = ((param): param is SupportedLang => {
	return isSupportedLang(param);
}) satisfies ParamMatcher;
