export const previewFamilies = [
	{
		id: 'plavna-modern',
		name_translation_key: 'article_editor.preview_plavna_modern'
	},
	{ id: 'custom', name_translation_key: 'article_editor.preview_custom' }
] as const;

// It seems that we can't .map() here cause later zod's .enum() wants a literal
export const previewFamiliesIds = ['plavna-modern', 'custom'] as const;
