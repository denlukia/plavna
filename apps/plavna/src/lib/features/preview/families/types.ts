import { assert, type TypeEqualityGuard } from '@plavna/image-uploader/types';
import type { Component } from 'svelte';
import type { SuperValidated } from 'sveltekit-superforms';
import type { ArticlePreviewUpdate } from '$lib/features/article/validators';
import type { SystemTranslationKey } from '$lib/features/i18n/types';
import type { TranslationUpdate } from '$lib/features/i18n/validators';
import type { ImageSelect } from '$lib/features/image/validators';

import { previewFamilies, previewFamiliesIds } from '.';
import type { PreviewTemplateSelect } from '../validators';

export type PreviewFamily = (typeof previewFamilies)[number];
type ExtractPreviewFamilyIds = (typeof previewFamiliesIds)[number];
type CheckPreviewFamilyIds = ExtractPreviewFamilyIds extends PreviewFamilyId ? true : false;

type ExtractId<T> = T extends { id: infer U } ? U : never;
export type PreviewFamilyId = ExtractId<(typeof previewFamilies)[number]>;
type PossibleNameTranslationIds = (typeof previewFamilies)[number]['name_translation_key'];
type CheckTranslationKey = PossibleNameTranslationIds extends SystemTranslationKey ? true : false;

export type PreviewComponentType = 'editor' | 'viewer';

// Will be red if previewFamiliesIds contains not all previewFamilies ids
assert<TypeEqualityGuard<CheckPreviewFamilyIds, true>>();
// Will be red if previewFamilies contains name_translation_key with not existing TranslationKey
assert<TypeEqualityGuard<CheckTranslationKey, true>>();

export type PreviewFamiliesDict = Partial<
	Record<
		PreviewFamilyId,
		{
			components: Record<PreviewComponentType, Promise<Component | null> | Component | null>;
			name_translation_key: PossibleNameTranslationIds;
		}
	>
>;

export type PreviewEditorProps = {
	mainSuperValidated: SuperValidated<ArticlePreviewUpdate>;
	preview_image_1: ImageSelect;
	preview_image_2: ImageSelect;
	translation_1: SuperValidated<TranslationUpdate>;
	translation_2: SuperValidated<TranslationUpdate>;
};

export type CustomPreviewEditorProps = PreviewEditorProps & {
	templateMeta: Pick<PreviewTemplateSelect, 'id' | 'name_translation_key'>;
};
