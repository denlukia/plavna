import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, '../..');

export function loadEnv() {
	const raw = fs.readFileSync(path.join(APP_DIR, '.env'), 'utf8');
	const env = {};
	for (const line of raw.split('\n')) {
		const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
		if (!m) continue;
		let v = m[2].trim();
		if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
		if (!(m[1] in process.env)) process.env[m[1]] = v;
		env[m[1]] = v;
	}
	return env;
}

// Minimal table defs mirroring apps/plavna/src/lib/**/schema.ts (insert/select only).
export const translations = sqliteTable('translations', {
	key: integer('key').primaryKey({ autoIncrement: true }),
	user_id: text('user_id'),
	en: text('en'),
	uk: text('uk')
});
export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').notNull(),
	name_translation_key: integer('name_translation_key').notNull()
});
export const tags_to_articles = sqliteTable('tags_to_articles', {
	tag_id: integer('tag_id').notNull(),
	article_id: integer('article_id').notNull()
});
export const articles = sqliteTable('articles', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').notNull(),
	slug: text('slug').notNull(),
	title_translation_key: integer('title_translation_key').notNull(),
	description_translation_key: integer('description_translation_key').notNull(),
	content_translation_key: integer('content_translation_key').notNull(),
	publish_time: integer('publish_time', { mode: 'timestamp' }),
	preview_columns: integer('preview_columns').notNull().default(1),
	preview_rows: integer('preview_rows').notNull().default(1),
	preview_family: text('preview_family'),
	preview_template_id: integer('preview_template_id'),
	preview_translation_1_key: integer('preview_translation_1_key').notNull(),
	preview_translation_2_key: integer('preview_translation_2_key').notNull(),
	preview_image_1_id: integer('preview_image_1_id').notNull(),
	preview_image_2_id: integer('preview_image_2_id').notNull(),
	preview_screenshot_image_id: integer('preview_screenshot_image_id'),
	preview_screenshot_in_article_image_id: integer('preview_screenshot_in_article_image_id'),
	preview_prop_1: text('preview_prop_1').default(''),
	preview_prop_2: text('preview_prop_2').default(''),
	preview_prop_3: text('preview_prop_3').default(''),
	preview_prop_4: text('preview_prop_4').default(''),
	md_source_url: text('md_source_url')
});
export const images = sqliteTable('images', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	user_id: text('user_id').notNull(),
	is_account_common: integer('is_account_common', { mode: 'boolean' }).notNull().default(false),
	owning_article_id: integer('owning_article_id'),
	source: text('source', { enum: ['imagekit'] }),
	path: text('path'),
	background: text('background'),
	width: integer('width'),
	height: integer('height')
});
export const screenshots_queue = sqliteTable('screenshots_queue', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	image_id: integer('image_id').notNull(),
	width: integer('width').notNull(),
	height: integer('height').notNull(),
	url: text('url').notNull(),
	lang: text('lang', { enum: ['en', 'uk'] }),
	imageProviderData: blob('image_provider_data', { mode: 'json' }).notNull()
});
export const sections = sqliteTable('sections', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	page_id: integer('page_id').notNull(),
	user_id: text('user_id').notNull(),
	title_translation_key: integer('title_translation_key').notNull(),
	max_rows: integer('max_rows').notNull().default(5)
});
export const sections_to_tags = sqliteTable('sections_to_tags', {
	section_id: integer('section_id').notNull(),
	tag_id: integer('tag_id').notNull(),
	lang: text('lang', { enum: ['en', 'uk'] }).notNull()
});
export const users = sqliteTable('auth_user', {
	id: text('id').primaryKey(),
	username: text('username').unique().notNull(),
	github_token: text('github_token'),
	imagekit_public_key: text('imagekit_public_key'),
	imagekit_private_key: text('imagekit_private_key'),
	imagekit_url_endpoint: text('imagekit_url_endpoint')
});
export const preview_templates = sqliteTable('preview_templates', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	url: text('url').notNull()
});

export function getDb() {
	const env = loadEnv();
	const client = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
	return drizzle(client);
}

/** Raw SQL through the underlying libsql client (this drizzle version has no db.execute). */
export async function raw(db, sqlText, args = []) {
	return db.$client.execute({ sql: sqlText, args });
}

export async function getActor(db, username) {
	const row = await db
		.select({
			id: users.id,
			github_token: users.github_token,
			imagekit_public_key: users.imagekit_public_key,
			imagekit_private_key: users.imagekit_private_key,
			imagekit_url_endpoint: users.imagekit_url_endpoint
		})
		.from(users)
		.where(eq(users.username, username))
		.get();
	if (!row) throw new Error(`User "${username}" not found`);
	return row;
}

const GITHUB_API = 'https://api.github.com';

export async function ghListDir(token, repo, dirPath) {
	const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${encodeURIComponent(dirPath)}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'User-Agent': 'plavna-book3-script'
		}
	});
	if (!res.ok) throw new Error(`GitHub list failed for "${dirPath}": ${res.status}`);
	return res.json();
}

export async function ghFetchRaw(token, repo, branch, filePath) {
	const url = `https://raw.githubusercontent.com/${repo}/${branch}/` + filePath.split('/').map(encodeURIComponent).join('/');
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'plavna-book3-script' }
	});
	if (!res.ok) throw new Error(`GitHub fetch failed for "${filePath}": ${res.status}`);
	return res.text();
}

export function ghBlobUrl(repo, branch, filePath) {
	return (
		`https://github.com/${repo}/blob/${branch}/` +
		filePath.split('/').map(encodeURIComponent).join('/')
	);
}

/** Split leading `## Title` heading from body. Returns { title, body }. */
export function splitTitle(md) {
	const lines = md.split('\n');
	let i = 0;
	while (i < lines.length && lines[i].trim() === '') i++;
	const m = (lines[i] || '').trim().match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
	if (!m) return { title: null, body: md };
	return { title: m[1].trim(), body: lines.slice(i + 1).join('\n') };
}

const TRANSLIT = {
	а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '', ю: 'yu', я: 'ya'
};

/** Transliterate Ukrainian title to a slug base (not length-checked). */
export function transliterate(title) {
	return title
		.toLowerCase()
		.split('')
		.map((ch) => {
			if (/[a-z0-9]/.test(ch)) return ch;
			if (Object.hasOwn(TRANSLIT, ch)) return TRANSLIT[ch];
			return '-';
		})
		.join('')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
}

const SLUG_RE = /^[a-z0-9-]*$/;

export function validateSlug(slug) {
	if (slug.length < 3) return 'min length 3';
	if (slug.length > 64) return 'max length 64';
	if (!SLUG_RE.test(slug)) return 'only latin letters, numbers and "-"';
	if (slug.startsWith('page:')) return 'reserved prefix "page:"';
	return null;
}

/** Rows for position i in a section display list of total items (3-2-2-3, lonely last takes 5). */
export function rowsForPosition(i, total) {
	if (total % 2 === 1 && i === total - 1) return 5;
	return [3, 2, 2, 3][i % 4];
}

// Preview card dimensions (CELL 260x130, GAP 8, ARTISTIC_OVERFLOW 16).
export function cardDims(cols, rows) {
	return { width: cols * 260 + (cols - 1) * 8 + 32, height: rows * 130 + (rows - 1) * 8 + 32 };
}

// Mirror of serializePreviewParams from @plavna/common (flat query builder).
export function serializeParams(baseUrl, params) {
	if (!baseUrl) return '';
	const url = baseUrl.split('?')[0];
	const parts = [];
	const process = (key, value, prefix = '') => {
		const finalKey = prefix ? `${prefix}[${key}]` : key;
		if (value === null || value === undefined) return;
		if (Array.isArray(value)) return value.forEach((item, idx) => process(String(idx), item, finalKey));
		if (typeof value === 'object' && !(value instanceof Date)) {
			return Object.entries(value).forEach(([k, v]) => process(k, v, finalKey));
		}
		const s = value instanceof Date ? value.toISOString() : String(value);
		parts.push(`${encodeURIComponent(finalKey)}=${encodeURIComponent(s)}`);
	};
	Object.entries(params).forEach(([k, v]) => process(k, v));
	return parts.length ? `${url}?${parts.join('&')}` : url;
}

export { and, eq };
