import { defaultLang, getLang } from '../i18n/utils';

export function generatePath(
	template: string,
	pageparams: Record<string, string | undefined>,
	additionalReplacements?: { [key: string]: string | undefined }
) {
	Object.entries({ ...pageparams, ...additionalReplacements }).forEach(([key, value]) => {
		const replacement = value || '';

		template = template.replace(`[${key}]`, replacement);
	});

	// Additionally replace value for [lang] key with nothing if lang is default
	const lang = getLang(pageparams.lang);
	if (lang === defaultLang) {
		template = template.replace('[lang]', '');
	} else {
		template = template.replace('[lang]', lang);
	}

	// Additionally replace [prefixedpageslug] with nothing if prefixedpageslug is empty
	if (template.includes('[prefixedpageslug]') && !pageparams.prefixedpageslug) {
		template = template.replace('[prefixedpageslug]', '');
	}

	// --- Important to do this in the very end ---
	template = template.replace(/\/+/g, '/');

	return template;
}
