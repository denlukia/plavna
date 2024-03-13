import { supportedLangs } from '@denlukia/plavna-common/constants';

import { defaultLang } from '$lib/isomorphic/languages';

import type { SupportedLang } from '@denlukia/plavna-common/types';

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
