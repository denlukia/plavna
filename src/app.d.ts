// See https://kit.svelte.dev/docs/types#app
import type { Session, User } from 'lucia';
import type { ArticleService } from '$lib/features/article/service';
import type { TranslationService } from '$lib/features/i18n/service';
import type {
	RecordsTranslationsDict,
	SystemTranslationDict,
	TranslationFormsDict
} from '$lib/features/i18n/types';
import type { ImageService } from '$lib/features/image/service';
import type { ImagesDict } from '$lib/features/image/types';
import type { PageService } from '$lib/features/page/service';
import type { PreviewFamiliesDict } from '$lib/features/preview/families/types';
import type { PreviewService } from '$lib/features/preview/service';
import type { SectionService } from '$lib/features/section/service';
import type { TagService } from '$lib/features/tag/service';
import type { TagsListForPage } from '$lib/features/tag/types';
import type { User } from '$lib/features/user/parsers';
import type { ActorService } from '$lib/features/user/service';
import type { ImageProviderSuperValidated } from '$lib/features/image/parsers';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			actor: User | null;
			session: Session | null;
			actorService: ActorService;
			translationService: TranslationService;
			pageService: PageService;
			sectionService: SectionService;
			tagService: TagService;
			imageService: ImageService;
			articleService: ArticleService;
			previewService: PreviewService;
		}

		interface PageData {
			actor: User | null;
			user: User | null;
			systemTranslations: SystemTranslationDict;
			imageProvider: {
				hasValidCredentialsSet: boolean;
				superValidated: ImageProviderSuperValidated;
			};
			recordsTranslations?: RecordsTranslationsDict;
			translationForms?: TranslationFormsDict;
			previewFamilies?: PreviewFamiliesDict;
			images?: ImagesDict;
			tags?: TagsListForPage;
			
		}
	}
}

export {};
