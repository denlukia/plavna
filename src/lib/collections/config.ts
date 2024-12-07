import { dev } from '$app/environment';
import { PUBLIC_HOST } from '$env/static/public';
import type { User } from 'lucia';

export const SECTIONS_PER_PAGE = 5;
export const ARTICLES_PER_SECTION = 7;
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
export const MAX_COLS_IN_SECTION = 5;
export const MAX_ROWS_IN_SECTION = 5;
export const ARTISTIC_OVERFLOW_PADDING = 20;

export const PAGE_CONFIG_COOKIE_NAME = 'page_config';

export const SECTION_RECONFIG_QUERY_PARAM_NAME = 'section_reconfig';

export const GET_PAGE_CONFIG_COOKIE_OPTIONS = (path: string) =>
	({
		path,
		maxAge: 60 * 60 * 24 * 365 // a year,
	}) as const;

type UserKeys = keyof User;

export const imageSourceToEndpointKeyInUser = {
	imagekit: 'imagekit_url_endpoint'
} as const satisfies Record<string, UserKeys>;

export const IMAGE_CREDENTIALS_PATH = `${dev ? 'http://' : 'https://'}${PUBLIC_HOST}/api/images/credentials`;

export const PAGE_SLUG_PREFIX = 'page:';

export const WAIT_BEFORE_AUTOSAVE_MS = 1000;

export const HIDDEN_TAG_PREFIX = '*';

export const SLUG_MIN_LENGTH = 3;

export const SLUG_MAX_LENGTH = 64;

export const SLUG_ALLOWED_CHARS_REGEX = /^[a-z0-9-]*$/i;
