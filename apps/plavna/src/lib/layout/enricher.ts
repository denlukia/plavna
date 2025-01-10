import type { SupportedLang } from '@plavna/image-uploader/types';

export async function enrichLogo(lang: SupportedLang) {
	try {
		return (await import(`./logo/languages/${lang}.svg?raw`)).default as string;
	} catch (e) {
		console.error('Logo component error:', e);
		return null;
	}
}
