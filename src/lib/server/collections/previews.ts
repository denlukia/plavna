import type { TranslationKey } from '../i18n/en';

type LocalPreview = {
	id: string;
	name_translation_id: TranslationKey;
};

export const localPreviewTypes: LocalPreview[] = [
	{
		id: 'plavna-modern',
		name_translation_id: 'preview_plavna_modern'
	}
];
