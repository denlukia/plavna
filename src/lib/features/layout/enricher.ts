import type { SupportedLang } from '@denlukia/plavna-common/types';

export async function enrichLogo(lang: SupportedLang) {
	try {
		return (await import(`./logo/languages/${lang}.svg?raw`,)).default as string;
	} catch (e) {
		console.error('Logo component error:', e);
		return null;
	}
}
