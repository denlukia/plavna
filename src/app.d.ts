// See https://kit.svelte.dev/docs/types#app
import type { ImageSelect, TagSelect, TranslationSelect } from '$lib/server/collections/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authRequest: import('lucia').AuthRequest;
			plavna: import('$lib/server/services/plavna').default;
		}
		interface PageData {
			user: Lucia.User | null;
			translations: Record<string, string | TranslationSelect>;
			tags?: Record<string, TagSelect>; // TODO Refactor into just array
			images?: ImageSelect[];
		}
	}
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/collections/types').Auth;
		type User = import('$lib/server/collections/types').User;
	}
}

export {};
