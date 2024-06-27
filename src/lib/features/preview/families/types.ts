import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';
import type { Component } from 'svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { ArticlePreviewUpdate } from '$lib/features/article/parsers';
import type { TranslationUpdate } from '$lib/features/i18n/parsers';
import type { SystemTranslationKey } from '$lib/features/i18n/types';
import type { ImageSelect } from '$lib/features/image/parsers';

import { previewFamilies, previewFamiliesIds } from '.';
import type { PreviewTemplateSelect } from '../parsers';
import type CutsomEditor from './custom/Editor.svelte';
import type PlavnaModernEditor from './plavna-modern/Editor.svelte';

export type PreviewFamily = (typeof previewFamilies)[number];
type ExtractPreviewFamilyIds = (typeof previewFamiliesIds)[number];
type CheckPreviewFamilyIds = ExtractPreviewFamilyIds extends PreviewFamilyId ? true : false;

type ExtractId<T> = T extends { id: infer U } ? U : never;
export type PreviewFamilyId = ExtractId<(typeof previewFamilies)[number]>;
type PossibleNameTranslationIds = (typeof previewFamilies)[number]['name_translation_key'];
type CheckTranslationKey = PossibleNameTranslationIds extends SystemTranslationKey ? true : false;

export type PreviewEditorComponent = Component<PlavnaModernEditor | CutsomEditor>;
type ComponentsDict = {
	components: {
		Static?: Component | null;
		Dynamic?: Component | null;
		Editor?: PreviewEditorComponent | null;
	};
};

// Will be red if previewFamiliesIds contains not all previewFamilies ids
assert<TypeEqualityGuard<CheckPreviewFamilyIds, true>>();
// Will be red if previewFamilies contains name_translation_key with not existing TranslationKey
assert<TypeEqualityGuard<CheckTranslationKey, true>>();

export type PreviewFamiliesDict = Record<PreviewFamilyId, ComponentsDict> & {
	custom?: ComponentsDict & {
		templates: Record<PreviewTemplateSelect['id'], PreviewTemplateSelect['url']>;
	};
};

export type PreviewEditorProps = {
	mainSuperValidated: SuperValidated<ArticlePreviewUpdate>;
	images: {
		preview_image_1: ImageSelect;
		preview_image_2: ImageSelect;
	};
	translationsSuperValidated: {
		translation_1: SuperValidated<TranslationUpdate>;
		translation_2: SuperValidated<TranslationUpdate>;
	};
	onPreviewPreviewRequest?: () => void; // Yep, we're requesting a preview of the preview component
};

export type CustomPreviewEditorProps = PreviewEditorProps & {
	templateMeta: Pick<PreviewTemplateSelect, 'id' | 'name_translation_key'>;
};
