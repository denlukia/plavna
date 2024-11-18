import type { SupportedLang } from '@denlukia/plavna-common/types';
import { ARTISTIC_OVERFLOW_PADDING, CELL } from '$lib/collections/config';

import type { TranslationSelect } from '../i18n/parsers';
import type { ImageSelect } from '../image/parsers';
import type { ArticlePreviewCellsTaken, ArticlePreviewScreenshotQuery } from './parsers';

export function composeURLForScreenshot(url: string, params: ArticlePreviewScreenshotQuery) {
	const urlObj = new URL(url);
	Object.entries(params).map(([key, value]) => {
		urlObj.searchParams.set(key, String(value ?? ''));
	});
	return urlObj.href;
}

export function calculateDimensionsFromCellsTaken({
	preview_columns,
	preview_rows
}: ArticlePreviewCellsTaken) {
	const { WIDTH, HEIGHT, GAP } = CELL;
	return {
		width: preview_columns * WIDTH + (preview_columns - 1) * GAP + ARTISTIC_OVERFLOW_PADDING * 2,
		height: preview_rows * HEIGHT + (preview_rows - 1) * GAP + ARTISTIC_OVERFLOW_PADDING * 2
	};
}

export function getMaybeTranslatedImagePath(
	imagesArr: ImageSelect[],
	translationsArr: TranslationSelect[],
	preview_image_id: ImageSelect['id'],
	lang: SupportedLang
) {
	const preview_image_1_base = imagesArr.find((i) => i.id === preview_image_id);
	const preview_image_1_translation = translationsArr.find(
		(t) => t.key === preview_image_1_base?.path_translation_key
	)?.[lang];
	return preview_image_1_translation || preview_image_1_base?.path || '';
}
