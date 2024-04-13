// See https://kit.svelte.dev/docs/types#app
import type { Session, User } from 'lucia';
import type { TranslationSelect } from '$lib/features/i18n/parsers';
import type { SystemTranslationDict } from '$lib/features/i18n/types';
import type { ImageSelect } from '$lib/features/image/parsers';
import type { TagSelect } from '$lib/features/tag/parsers';
import type Plavna from '$lib/services/plavna';

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
