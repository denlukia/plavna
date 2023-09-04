import type { TranslationKey } from '../i18n/en';

export const previewFamilies = [
	{
		id: 'plavna-modern',
		name_translation_id: 'preview_plavna_modern'
	}
] as const;

export type PreviewFamily = (typeof previewFamilies)[number];

// It seems that we can't .map() here cause later zod's .enum() wants a literal
export const previewFamiliesIds = ['plavna-modern'] as const;

type ExtractPreviewFamilyIds = (typeof previewFamiliesIds)[number];
type CheckPreviewFamilyIds = ExtractPreviewFamilyIds extends PossiblePreviewFamilies ? true : false;
let previewFamilyIdsAreCorrect: CheckPreviewFamilyIds = true;

type ExtractId<T> = T extends { id: infer U } ? U : never;
export type PossiblePreviewFamilies = ExtractId<(typeof previewFamilies)[number]>;

type PossibleNameTranslationIds = (typeof previewFamilies)[number]['name_translation_id'];
type CheckTranslationKey = PossibleNameTranslationIds extends TranslationKey ? true : false;
let nameTranslationIdsAreCorrect: CheckTranslationKey = true;
