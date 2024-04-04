import type { SupportedLang } from '@denlukia/plavna-common/types';

import en from './en';
import type { TranslationKey } from './en';
import uk from './uk';

export const systemTranslations = { en, uk };

export function getTranslationsByLangAndKeys(lang: string, keys: TranslationKey[]) {
	return Object.fromEntries(
		keys.map((key) => {
			const translation: string = systemTranslations[lang as SupportedLang][key];
			return [key, translation];
		})
	);
}

export const createGroup = (keys: TranslationKey[]) => (lang: string) =>
	getTranslationsByLangAndKeys(lang, keys);

export const serviceTranslations = {
	auth: createGroup(['login', 'signup']),
	login: createGroup(['to_login', 'email', 'password', 'sign_in_with_github']),
	signup: createGroup(['to_signup', 'username', 'password']),
	layout: createGroup(['language']),
	main: createGroup(['landing', 'to_sign_out']),
	articleEditor: createGroup(['preview_plavna_modern']),
	userPages: createGroup([
		'my_pages',
		'couldnt_create_page',
		'invalid_slug',
		'slug_in_use',
		'only_one_default_slug',
		'delete_page',
		'edit_page',
		'create_new_page',
		'couldnt_delete_page',
		'couldnt_edit_page',
		'main_page'
	])
};
