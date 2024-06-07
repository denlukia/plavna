import { defaultLang } from '../i18n/utils';

export function generatePath(
	template: string,
	pageparams: Record<string, string>,
	additionalReplacements?: { [key: string]: string | undefined }
) {
	Object.entries({ ...pageparams, ...additionalReplacements }).forEach(([key, value]) => {
		let replacement = value || '';

		// Additionally replace value for [lang] key with nothing if lang is default
		if (key === 'lang' && value === defaultLang) {
			replacement = '';
		}

		template = template.replace(`[${key}]`, replacement);
	});

	template = template.replace(/\/+/g, '/');
	return template;
}
