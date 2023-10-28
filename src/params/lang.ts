import { isSupportedLang } from '$lib/isomorphic/languages';

export function match(param) {
	return isSupportedLang(param);
}
