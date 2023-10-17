import type { SupportedLang } from '$lib/isomorphic/languages';
import type {
	ArticlePreviewImageFileFieldsAll,
	ArticlePreviewImageIdsFields
} from '../collections/types';

export function decomposeImageField(field: keyof ArticlePreviewImageFileFieldsAll) {
	const parts = field.split('.');
	return {
		fieldNameWithIdPrefix: `${parts[0]}_id` as keyof ArticlePreviewImageIdsFields,
		lang: (parts[1] || null) as SupportedLang | null
	};
}
