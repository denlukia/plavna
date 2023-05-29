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
	login: createGroup(['login', 'to_login', 'username', 'password']),
	signup: createGroup(['signup', 'to_signup', 'username', 'password']),
	layout: createGroup(['language']),
	main: createGroup(['profile', 'user_id', 'username', 'to_sign_out'])
};
