import { isSupportedLang } from '$lib/features/i18n/utils';

export function match(param) {
	return isSupportedLang(param);
}
