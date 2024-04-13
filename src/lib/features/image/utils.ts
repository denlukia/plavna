import type { SupportedLang } from '@denlukia/plavna-common/types';

import type {
	ArticlePreviewImageFileFieldsAll,
	ArticlePreviewImageIdsFields
} from '../article/parsers';

export function decomposeImageField(field: keyof ArticlePreviewImageFileFieldsAll) {
	const parts = field.split('.');
	return {
		fieldNameWithIdPrefix: `${parts[0]}_id` as keyof ArticlePreviewImageIdsFields,
		lang: (parts[1] || null) as SupportedLang | null
	};
}
