import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';
import type { SystemTranslationKey } from '$lib/features/i18n/types';

export const previewFamilies = [
	{
		id: 'plavna-modern',
		name_translation_key: 'article_editor.preview_plavna_modern'
	},
	{ id: 'custom', name_translation_key: 'article_editor.preview_custom' }
] as const;

export type PreviewFamily = (typeof previewFamilies)[number];

// It seems that we can't .map() here cause later zod's .enum() wants a literal
export const previewFamiliesIds = ['plavna-modern', 'custom'] as const;

type ExtractPreviewFamilyIds = (typeof previewFamiliesIds)[number];
type CheckPreviewFamilyIds = ExtractPreviewFamilyIds extends PreviewFamilyId ? true : false;

assert<TypeEqualityGuard<CheckPreviewFamilyIds, true>>(); // Will be red if previewFamiliesIds contains not all previewFamilies ids

type ExtractId<T> = T extends { id: infer U } ? U : never;
export type PreviewFamilyId = ExtractId<(typeof previewFamilies)[number]>;

type PossibleNameTranslationIds = (typeof previewFamilies)[number]['name_translation_key'];
type CheckTranslationKey = PossibleNameTranslationIds extends SystemTranslationKey ? true : false;

assert<TypeEqualityGuard<CheckTranslationKey, true>>(); // Will be red if previewFamilies contains name_translation_key with not existing TranslationKey
