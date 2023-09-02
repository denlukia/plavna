// See https://kit.svelte.dev/docs/types#app

import type { TagSelect, TranslationInsertZod } from '$lib/server/collections/types';

import type { SuperValidated } from 'sveltekit-superforms';
import type { SuperForm } from 'sveltekit-superforms/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authRequest: import('lucia').AuthRequest;
			plavna: import('$lib/server/services/plavna').default;
		}
		interface PageData {
			user: Lucia.User | null;
			translations: Record<string, string | SuperValidated<TranslationInsertZod>>;
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
