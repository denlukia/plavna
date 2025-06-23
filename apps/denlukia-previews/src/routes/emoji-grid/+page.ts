import { deserializePreviewParams } from '@plavna/common';

export async function load({ url }) {
	return { ...deserializePreviewParams(url.toString()) };
}
