import { supportedLanguages, type SupportedLang, defaultLang } from '$lib/common/languages';
import type { PossibleTransKey } from './system-translations/en';
import en from './system-translations/en';
import uk from './system-translations/uk';

export const systemTranslations = { en, uk };

export function getTransByLangAndKeys(lang: string | undefined, keys: PossibleTransKey[]) {
	if (lang && !supportedLanguages.includes(lang as SupportedLang)) {
		return null;
	}
	return Object.fromEntries(
		keys.map((key) => {
			return [key, systemTranslations[(lang as SupportedLang) || defaultLang][key]];
		})
	);
}

export const createGroup = (keys: PossibleTransKey[]) => (lang: string | undefined) =>
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
		'delete_page'
	])
};
