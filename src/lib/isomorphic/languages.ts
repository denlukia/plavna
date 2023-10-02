// By ISO 639-1
export const supportedLangs = ['en', 'uk'] as const;
export type SupportedLang = (typeof supportedLangs)[number];

export const defaultLang: SupportedLang = 'en';
export function isSupportedLang(lang: string): lang is SupportedLang {
	return supportedLangs.includes(lang as SupportedLang);
}
