// See https://kit.svelte.dev/docs/types#app
import type { Session, User } from 'lucia';
import type { ArticleService } from '$lib/features/article/service';
import type { UserService } from '$lib/features/auth/service';
import type { TranslationSelect } from '$lib/features/i18n/parsers';
import type { TranslationService } from '$lib/features/i18n/service';
import type { RecordsTranslations, SystemTranslationDict } from '$lib/features/i18n/types';
import type { ImageSelect } from '$lib/features/image/parsers';
import type { ImageService } from '$lib/features/image/service';
import type { PageService } from '$lib/features/page/service';
import type { PreviewType } from '$lib/features/preview/parsers';
import type { PreviewService } from '$lib/features/preview/service';
import type { SectionService } from '$lib/features/section/service';
import type { TagSelect } from '$lib/features/tag/parsers';
import type { TagService } from '$lib/features/tag/service';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
			// plavna: Plavna;
			userService: UserService;
			translationService: TranslationService;
			pageService: PageService;
			sectionService: SectionService;
			tagService: TagService;
			imageService: ImageService;
			articleService: ArticleService;
			previewService: PreviewService;
		}

		interface PageData {
			user: User | null;
			systemTranslations: SystemTranslationDict;
			recordsTranslations?: RecordsTranslations;
			previewTypes?: PreviewType;
			tags?: Record<string, TagSelect>; // TODO Refactor into just array
			images?: ImageSelect[];
		}
	}
}

export {};
