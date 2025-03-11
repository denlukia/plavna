import { deserializePreviewParams } from '@plavna/common';

export function load({ url }) {
	return deserializePreviewParams(url.toString());
}
