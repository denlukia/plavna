export const SECTIONS_PER_LOAD = 2;
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

export const CELL = { WIDTH: 200, HEIGHT: 100, GAP: 10 };
export const ARTISTIC_OVERFLOW_PADDING = 20;
