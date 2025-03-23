import type { HTMLFormAttributes } from 'svelte/elements';
import type { SystemTranslationKey } from '$lib/i18n/types';

export const previewFamilies = [
	{
		id: 'modern',
		name_translation_key: 'article_editor.previews.families.modern.name'
	},
	{
		id: 'sequences',
		name_translation_key: 'article_editor.previews.families.sequences.name'
	},
	{
		id: 'two-images',
		name_translation_key: 'article_editor.previews.families.two-images.name'
	},
	{
		id: 'in-frame',
		name_translation_key: 'article_editor.previews.families.in-frame.name'
	},
	{ id: 'custom', name_translation_key: 'article_editor.previews.families.custom.name' }
] as const satisfies { id: string; name_translation_key: SystemTranslationKey }[];

// It seems that we can't .map() here cause later zod's .enum() wants a literal
export const previewFamiliesIds = [
	'modern',
	'sequences',
	'two-images',
	'in-frame',
	'custom'
] as const;

export const PREVIEW_EDITOR_FORM_ATTRS: HTMLFormAttributes = {
	method: 'POST',
	action: '?/update_preview',
	enctype: 'multipart/form-data',
	id: 'preview-editor-form'
};
