import { ARTISTIC_OVERFLOW } from '@plavna/common';

import type {} from '$lib/preview/validators';

import { CELL } from '$lib/styles/grid';

import type { ArticlePreviewCellsTaken } from './validators';

export function calculateDimensionsFromCellsTaken({
	preview_columns,
	preview_rows
}: ArticlePreviewCellsTaken) {
	const { WIDTH, HEIGHT, GAP } = CELL;
	return {
		width: preview_columns * WIDTH + (preview_columns - 1) * GAP + ARTISTIC_OVERFLOW * 2,
		height: preview_rows * HEIGHT + (preview_rows - 1) * GAP + ARTISTIC_OVERFLOW * 2
	};
}
