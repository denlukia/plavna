import type { HTMLFormAttributes } from 'svelte/elements';
import type { SystemTranslationKey } from '$lib/features/i18n/types';

export const previewFamilies = [
	{
		id: 'plavna-modern',
		name_translation_key: 'article_editor.previews.families.plavna_modern.name'
	},
	{ id: 'custom', name_translation_key: 'article_editor.previews.families.custom.name' }
] as const satisfies { id: string; name_translation_key: SystemTranslationKey }[];

// It seems that we can't .map() here cause later zod's .enum() wants a literal
export const previewFamiliesIds = ['plavna-modern', 'custom'] as const;

export const PREVIEW_EDITOR_FORM_ATTRS: HTMLFormAttributes = {
	method: 'POST',
	action: '?/update_preview',
	enctype: 'multipart/form-data',
	id: 'preview-editor-form'
};
