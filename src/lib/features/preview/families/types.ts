import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';
import type { SystemTranslationKey } from '$lib/features/i18n/types';

import { previewFamilies, previewFamiliesIds } from '.';
import type { PreviewTemplateSelect } from '../parsers';

export type PreviewFamily = (typeof previewFamilies)[number];
type ExtractPreviewFamilyIds = (typeof previewFamiliesIds)[number];
type CheckPreviewFamilyIds = ExtractPreviewFamilyIds extends PreviewFamilyId ? true : false;

type ExtractId<T> = T extends { id: infer U } ? U : never;
export type PreviewFamilyId = ExtractId<(typeof previewFamilies)[number]>;
type PossibleNameTranslationIds = (typeof previewFamilies)[number]['name_translation_key'];
type CheckTranslationKey = PossibleNameTranslationIds extends SystemTranslationKey ? true : false;

type PreviewComponentTypes = 'Static' | 'Editor' | 'Preview';
type ComponentsDict = {
	components: Record<PreviewComponentTypes, ConstructorOfATypedSvelteComponent | null>;
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
