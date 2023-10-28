// See https://kit.svelte.dev/docs/types#app
import type { TagSelect } from '$lib/server/collections/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authRequest: import('lucia').AuthRequest;
			plavna: import('$lib/server/services/plavna').default;
			imageHandler: import('plavna-common').ServerImageHandler;
		}
		interface PageData {
			user: Lucia.User | null;
			translations: Record<string, string>;
			tags?: Record<string, TagSelect>;
		}
		// interface Platform {}
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
