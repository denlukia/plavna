// See https://kit.svelte.dev/docs/types#app
import type { ImageSelect, TagSelect, TranslationSelect } from '$lib/server/collections/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
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

export {};
