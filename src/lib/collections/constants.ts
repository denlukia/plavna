import { dev } from '$app/environment';
import { PUBLIC_HOST, PUBLIC_PORT } from '$env/static/public';
import type { CookieSerializeOptions } from 'node_modules/sveltekit-superforms/dist/actionResult';

export const SECTIONS_PER_LOAD = 3;
export const POSTS_PER_SECTION = 10;
export const PREVIEW_FAMILY_PARAM = 'preview-family';
export const PREVIEW_TEMPLATE_PARAM = 'preview-template';
export const IMAGEKIT_UPLOAD_ENDPOINT = 'https://upload.imagekit.io/api/v2/files/upload';

export const SUPPORTED_FORMATS = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/svg+xml': 'svg'
} as const;

export const SUPPORTED_IMAGE_MIMES = [
	'image/svg+xml',
	'image/avif',
	'image/heic',
	'image/webp',
	'image/png',
	'image/jpeg',
	'image/gif'
];

export const MAX_IMAGE_SIZE_MB = 25; // 25MB

export const IMG_VALIDATION_CONFIG = {
	formats: SUPPORTED_IMAGE_MIMES,
	maxSizeMb: MAX_IMAGE_SIZE_MB
};

export const CELL = { WIDTH: 200, HEIGHT: 100, GAP: 10 };
export const ARTISTIC_OVERFLOW_PADDING = 20;
export const HOST = dev ? `${PUBLIC_HOST}:${PUBLIC_PORT}` : `${PUBLIC_HOST}`;

// export const GET_PAGE_CONFIG_COOKIE_NAME = (username: string, pageslug: string | undefined) => {
// 	let result = `page-config-${username}`;
// 	if (pageslug) {
// 		result += `-${pageslug}`;
// 	}
// 	return result;
// };
export const PAGE_CONFIG_COOKIE_NAME = 'page-config';

export const GET_PAGE_CONFIG_COOKIE_OPTIONS = (path: string) =>
	({
		path,
		maxAge: 60 * 60 * 24 * 365 // a year,
	}) as const;
