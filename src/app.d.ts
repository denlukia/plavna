// See https://kit.svelte.dev/docs/types#app
import type { Session, User } from 'lucia';
import type { SystemTranslationDict } from '$lib/(features)/common/translations/_types';
import type { ImageSelect, TagSelect, TranslationSelect } from '$lib/server/collections/types';
import type Plavna from '$lib/server/services/plavna';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
			plavna: Plavna;
		}

		interface PageData {
			user: User | null;
			systemTranslations: SystemTranslationDict;
			recordsTranslations?: Record<TranslationSelect['key'], string>;
			tags?: Record<string, TagSelect>; // TODO Refactor into just array
			images?: ImageSelect[];
		}
	}
}

export {};
