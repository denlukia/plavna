// See https://kit.svelte.dev/docs/types#app
import type { SupportedLang } from '@plavna/common';
import type { Session } from 'lucia';
import type { ArticleService } from '$lib/article/service';
import type { TranslationService } from '$lib/i18n/service';
import type { RecordsTranslationsState } from '$lib/i18n/state.svelte';
import type {
	ImageInputsTranslationsDict,
	SystemTranslationDict,
	TranslationFormsDict
} from '$lib/i18n/types';
import type { ImageService } from '$lib/image/service';
import type { ImagesState } from '$lib/image/state.svelte';
import type { ImageProviderSuperValidated } from '$lib/image/validators';
import type { PageService } from '$lib/page/service';
import type { PreviewFamiliesState } from '$lib/preview/families/state.svelte';
import type { PreviewService } from '$lib/preview/service';
import type { SectionService } from '$lib/section/service';
import type { TagService } from '$lib/tag/service';
import type { TagsListForPage } from '$lib/tag/types';
import type { ActorService } from '$lib/user/service';
import type { Actor, User } from '$lib/user/validators';

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
