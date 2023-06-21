// By ISO 639-1
export const supportedLanguages = ['en', 'uk'] as const;
export type SupportedLang = (typeof supportedLanguages)[number];

export const defaultLang: SupportedLang = 'en';
