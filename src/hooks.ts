import { supportedLangs } from '@denlukia/plavna-common/constants';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import { defaultLang } from '$lib/features/i18n/utils';

const NON_LANGUAGED_ROUTES = ['api'];

export function reroute({ url }) {
	// If first part of pathname in not in supportedLangs add default lang part in the beginning
	// But only if first part is not in non languaged routes

	const pathParts = url.pathname.split('/');
	const firstPart = pathParts[1];
	if (
		!NON_LANGUAGED_ROUTES.includes(firstPart) &&
		!supportedLangs.includes(firstPart as SupportedLang)
	) {
		const newPathname = `/${defaultLang}${url.pathname}`;

		return newPathname;
	}
}
