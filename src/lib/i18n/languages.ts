// By ISO 639-1
export const supportedLanguages = ['en', 'uk'] as const;
export const defaultLang: SupportedLang = 'en';

export type SupportedLang = (typeof supportedLanguages)[number];
