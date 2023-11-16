import { supportedLangs } from '@denlukia/plavna-common/constants';

import type { SupportedLang } from '@denlukia/plavna-common/types';

export const defaultLang: SupportedLang = 'en';
export function isSupportedLang(lang: string): lang is SupportedLang {
	return supportedLangs.includes(lang as SupportedLang);
}
