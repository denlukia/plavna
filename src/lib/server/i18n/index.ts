import en from './system-translations/en';
import uk from './system-translations/uk';

import { type SupportedLang, defaultLang, supportedLanguages } from '$lib/client-server/languages';

import type { TranslationKey } from './system-translations/en';

export const systemTranslations = { en, uk };

export function getTransByLangAndKeys(lang: string | undefined, keys: TranslationKey[]) {
	if (lang && !supportedLanguages.includes(lang as SupportedLang)) {
		return null;
	}
	return Object.fromEntries(
		keys.map((key) => {
			return [key, systemTranslations[(lang as SupportedLang) || defaultLang][key]];
		})
	);
}

export const createGroup = (keys: TranslationKey[]) => (lang: string | undefined) =>
	getTransByLangAndKeys(lang, keys);

export const transGroups = {
	auth: createGroup(['login', 'signup', 'username', 'password']),
	login: createGroup(['to_login', 'username', 'password']),
	signup: createGroup(['to_signup', 'username', 'password']),
	layout: createGroup(['language']),
	main: createGroup(['landing', 'to_sign_out']),
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
