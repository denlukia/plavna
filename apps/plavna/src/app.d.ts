// See https://kit.svelte.dev/docs/types#app
import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { Session } from 'lucia';
import type { ArticleService } from '$lib/features/article/service';
import type { TranslationService } from '$lib/features/i18n/service';
import type { RecordsTranslationsState } from '$lib/features/i18n/state.svelte';
import type {
	ImageInputsTranslationsDict,
	SystemTranslationDict,
	TranslationFormsDict
} from '$lib/features/i18n/types';
import type { ImageService } from '$lib/features/image/service';
import type { ImagesState } from '$lib/features/image/state.svelte';
import type { ImageProviderSuperValidated } from '$lib/features/image/validators';
import type { PageService } from '$lib/features/page/service';
import type { PreviewFamiliesState } from '$lib/features/preview/families/state.svelte';
import type { PreviewService } from '$lib/features/preview/service';
import type { SectionService } from '$lib/features/section/service';
import type { TagService } from '$lib/features/tag/service';
import type { TagsListForPage } from '$lib/features/tag/types';
import type { ActorService } from '$lib/features/user/service';
import type { Actor, User } from '$lib/features/user/validators';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			actor: Actor | null;
			session: Session | null;
			actorService: ActorService;
			translationService: TranslationService;
			pageService: PageService;
			sectionService: SectionService;
			tagService: TagService;
			imageService: ImageService;
			articleService: ArticleService;
			previewService: PreviewService;
			lang: SupportedLang;
		}

		interface PageData {
			actor: Actor | null;
			user: User | null;
			systemTranslations: SystemTranslationDict;
			imageInputsTranslations?: ImageInputsTranslationsDict;
			translationForms?: TranslationFormsDict;
			tags?: TagsListForPage;
			imageProvider: {
				hasValidCredentialsSet: boolean;
				superValidated: ImageProviderSuperValidated;
			};

			// Global states with manual mutation support
			recordsTranslationsState?: RecordsTranslationsState;
			previewFamiliesState?: PreviewFamiliesState;
			imagesState?: ImagesState;
		}
	}
}

export {};
