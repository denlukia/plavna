import { supportedLangs } from '@denlukia/plavna-common/constants';
import type { SupportedLang } from '@denlukia/plavna-common/types';
import { dev } from '$app/environment';
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
		let newPathname = `/${defaultLang}${url.pathname}`;

		// For some reason it doesn't take into account the query string but only on vercel
		if (!dev) {
			newPathname += url.search;
		}

		return newPathname;
	}
}
