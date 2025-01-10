import { PAGE_SLUG_PREFIX } from '$lib/common/config';

import { defaultLang, getLang } from '../i18n/utils';

export function generatePath(
	template: string,
	pageparams: Record<string, string | undefined>,
	additionalReplacements: { [key: string]: string | undefined } = {}
) {
	// Replace [lang] with nothing if lang is default
	if (!('lang' in additionalReplacements)) {
		const lang = getLang(pageparams.lang);
		if (lang === defaultLang) {
			template = template.replace('[lang]', '');
		} else {
			template = template.replace('[lang]', lang);
		}
	}

	//  Replace [pageslug] with prefixed one or nothing
	if (!('pageslug' in additionalReplacements)) {
		if (pageparams.pageslug) {
			const prefixedPageslug = PAGE_SLUG_PREFIX + pageparams.pageslug;
			template = template.replace('[pageslug]', prefixedPageslug);
		} else {
			template = template.replace('[pageslug]', '');
		}
	}

	Object.entries({ ...pageparams, ...additionalReplacements }).forEach(([key, value]) => {
		const replacement = value || '';

		template = template.replace(`[${key}]`, replacement);
	});

	// --- Important to do this in the very end ---
	template = template.replace(/\/+/g, '/');

	return template;
}
