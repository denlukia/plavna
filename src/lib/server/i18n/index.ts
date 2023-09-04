import en from './en';
import uk from './uk';

import { type SupportedLang, defaultLang } from '$lib/isomorphic/languages';

import type { TranslationKey } from './en';

export const systemTranslations = { en, uk };

export function getTranslationsByLangAndKeys(lang: string, keys: TranslationKey[]) {
	return Object.fromEntries(
		keys.map((key) => {
			const translation: string = systemTranslations[(lang as SupportedLang) || defaultLang][key];
			return [key, translation];
		})
	);
}

export const createGroup = (keys: TranslationKey[]) => (lang: string) =>
	getTranslationsByLangAndKeys(lang, keys);

export const serviceTranslations = {
	auth: createGroup(['login', 'signup', 'username', 'password']),
	login: createGroup(['to_login', 'username', 'password']),
	signup: createGroup(['to_signup', 'username', 'password']),
	layout: createGroup(['language']),
	main: createGroup(['landing', 'to_sign_out']),
	articleEditor: createGroup(['preview_plavna_modern']),
	userPages: createGroup([
		'couldnt_create_page',
		'invalid_slug',
		'slug_in_use',
		'only_one_default_slug',
		'delete_page',
		'edit_slug',
		'create_new_page',
		'couldnt_delete_page',
		'couldnt_edit_page'
	])
};
