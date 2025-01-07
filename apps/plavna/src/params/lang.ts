import type { SupportedLang } from '@plavna/image-uploader/types';
import type { ParamMatcher } from '@sveltejs/kit';
import { isSupportedLang } from '$lib/features/i18n/utils';

export const match = ((param): param is SupportedLang => {
	return isSupportedLang(param);
}) satisfies ParamMatcher;
