// Re-imports Book 3 articles that reference images, uploading each image to
// the author's ImageKit storage and rewriting refs to Plavna `![alt](id)`
// codes. Mirrors ArticleService.importFromMd image rules (see md-import/).
// Title/slug/description/md_source_url are left untouched; existing trailing
// `## Далі:` / `## Кінець …` blocks are preserved. Previews are not touched.
//
// Usage (from apps/plavna, Node 24+ for TS imports):
//   pnpm exec node scripts/book-3/reimport-images.mjs           # dry run
//   pnpm exec node scripts/book-3/reimport-images.mjs --live    # writes to DB

import ImageKit from 'imagekit';
import { getActor, getDb, raw, articles, translations, images } from './lib.mjs';
import { and, desc, eq, like } from 'drizzle-orm';
import { USERNAME, TEMPLATE_URL_MATCH } from './config.mjs';
import { parseMdDocument } from '../../src/lib/article/md-import/frontmatter.ts';
import {
	extractImageRefs,
	resolveImageUrl,
	rewriteImageRef
} from '../../src/lib/article/md-import/images.ts';
import { isGithubHostedMarkdownUrl, toRawMarkdownUrl } from '../../src/lib/article/md-import/github-url.ts';

const LIVE = process.argv.includes('--live');
const MAX_BYTES = 25 * 1000000;
const MAGIC = [
	{ mime: 'image/png', test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
	{ mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 },
	{ mime: 'image/gif', test: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
	{
		mime: 'image/webp',
		test: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
	},
	{
		mime: 'image/svg+xml',
		test: (b) => b.length > 200 && /<svg[\s>]/i.test(Buffer.from(b.slice(0, 500)).toString('utf8'))
	}
];
const ALLOWED = new Set(['image/svg+xml', 'image/webp', 'image/png', 'image/jpeg', 'image/gif']);

function sniffMime(bytes) {
	const b = new Uint8Array(bytes);
	for (const m of MAGIC) {
		try {
			if (m.test(b)) return m.mime;
		} catch {
			// ignore
		}
	}
	return null;
}

function u16le(b, o) {
	return b[o] | (b[o + 1] << 8);
}
function u32be(b, o) {
	return (b[o] * 16777216 + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3]) >>> 0;
}

/** Best-effort dimensions from image bytes; null when unknown. */
function probeDims(bytes, mime) {
	try {
		const b = new Uint8Array(bytes);
		if (mime === 'image/png' && b.length >= 24) return { width: u32be(b, 16), height: u32be(b, 20) };
		if (mime === 'image/gif' && b.length >= 10) return { width: u16le(b, 6), height: u16le(b, 8) };
		if (mime === 'image/webp' && b.length >= 30) {
			const fourcc = String.fromCharCode(b[12], b[13], b[14], b[15]);
			if (fourcc === 'VP8 ' && b.length >= 30)
				return { width: u16le(b, 26) & 0x3fff, height: u16le(b, 28) & 0x3fff };
			if (fourcc === 'VP8L' && b.length >= 25)
				return { width: (u16le(b, 21) & 0x3fff) + 1, height: (((u16le(b, 21) >> 14) | (u16le(b, 23) << 2)) & 0x3fff) + 1 };
			if (fourcc === 'VP8X' && b.length >= 30)
				return { width: (u32be(b, 24) & 0xffffff) + 1, height: ((u32be(b, 24) >> 24) | (u32be(b, 27) << 8) | 0) + 1 || null };
		}
		if (mime === 'image/jpeg') {
			let o = 2;
			while (o + 9 < b.length) {
				if (b[o] !== 0xff) break;
				const marker = b[o + 1];
				const len = (b[o + 2] << 8) | b[o + 3];
				if (marker >= 0xc0 && marker <= 0xc3) {
					return { width: (b[o + 7] << 8) | b[o + 8], height: (b[o + 5] << 8) | b[o + 6] };
				}
				if (len < 2) break;
				o += 2 + len;
			}
		}
		if (mime === 'image/svg+xml') {
			const text = Buffer.from(b.slice(0, 4000)).toString('utf8');
			const w = text.match(/\bwidth\s*=\s*["']?([\d.]+)/i);
			const h = text.match(/\bheight\s*=\s*["']?([\d.]+)/i);
			if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) };
			const vb = text.match(/\bviewBox\s*=\s*["']?([\d.\s-]+)["']?/i);
			if (vb) {
				const parts = vb[1].trim().split(/[\s,]+/).map(Number);
				if (parts.length === 4 && parts[2] > 0 && parts[3] > 0)
					return { width: Math.round(parts[2]), height: Math.round(parts[3]) };
			}
		}
	} catch {
		// fall through to null
	}
	return null;
}

function endingBlock(content) {
	const m = content.match(/\n\n## (?:Далі:.*|Кінець третьої книги)\s*$/s);
	return m ? m[0] : '';
}

async function main() {
	const db = getDb();
	const actor = await getActor(db, USERNAME);
	if (!actor.github_token) throw new Error('No GitHub token stored');
	const provider = {
		publicKey: actor.imagekit_public_key,
		privateKey: actor.imagekit_private_key,
		urlEndpoint: actor.imagekit_url_endpoint
	};
	if (!provider.publicKey || !provider.privateKey || !provider.urlEndpoint) {
		throw new Error('No ImageKit provider connected — connect it in Settings first');
	}
	const q = async (sql, args = []) => (await raw(db, sql, args)).rows;
	const tplRows = await q('SELECT id, url FROM preview_templates WHERE user_id = ?', [actor.id]);
	if (!tplRows.find((r) => String(r.url).includes(TEMPLATE_URL_MATCH))) {
		throw new Error('emoji-grid preview template not found');
	}

	const chain = await db
		.select({
			id: articles.id,
			slug: articles.slug,
			contentKey: articles.content_translation_key,
			mdUrl: articles.md_source_url
		})
		.from(articles)
		.where(and(eq(articles.user_id, actor.id), like(articles.md_source_url, '%rationality-ua-private%')))
		.orderBy(desc(articles.publish_time))
		.all();

	const imagekit = new ImageKit(provider);
	let touched = 0;
	for (const a of chain) {
		const rawUrl = toRawMarkdownUrl(a.mdUrl);
	 const text = await (async () => {
			const headers = isGithubHostedMarkdownUrl(rawUrl) ? { Authorization: `Bearer ${actor.github_token}` } : {};
			const res = await fetch(rawUrl, { headers });
			if (!res.ok) throw new Error(`md fetch failed: ${res.status}`);
			return res.text();
		})();
		const doc = parseMdDocument(text);
		const refs = extractImageRefs(doc.body);
		if (!refs.length) continue;
		touched++;
		console.log(`\n${a.slug}: ${refs.length} image(s)`);
		const rawDir = rawUrl.slice(0, rawUrl.lastIndexOf('/') + 1);
		let body = doc.body;
		const warnings = [];
		const fetched = [];
		for (const ref of refs) {
			const absolute = resolveImageUrl(ref.url, rawDir);
			if (absolute === null) {
				warnings.push(`unsupported URL ${ref.url}`);
				continue;
			}
			try {
				const headers = isGithubHostedMarkdownUrl(absolute) ? { Authorization: `Bearer ${actor.github_token}` } : {};
				const res = await fetch(absolute, { headers });
				if (!res.ok) throw new Error(`status ${res.status}`);
				const bytes = await res.arrayBuffer();
				if (bytes.byteLength >= MAX_BYTES) throw new Error('too big');
				const mime = sniffMime(bytes);
				if (!mime || !ALLOWED.has(mime)) throw new Error(`unsupported type ${mime}`);
				fetched.push({ ref, bytes, mime });
				console.log(`  ok ${ref.url}${LIVE ? '' : ' (not uploaded in dry run)'}`);
			} catch (e) {
				warnings.push(`${ref.url}: ${e.message || e}`);
			}
		}
		for (const w of warnings) console.log(`  SKIP ${w}`);
		if (!LIVE) continue;
		const replacements = [];
		for (const { ref, bytes, mime } of fetched) {
			const record = (
				await db
					.insert(images)
					.values({ user_id: actor.id, is_account_common: false, owning_article_id: a.id, source: 'imagekit' })
					.returning({ id: images.id })
					.all()
			)[0];
			try {
				const uploaded = await imagekit.upload({
					file: Buffer.from(bytes),
					fileName: 'original',
					folder: `PLAVNA_STORAGE_V0/image-${record.id}/universal`,
					useUniqueFileName: true
				});
				const dims = probeDims(bytes, mime);
				await db
					.update(images)
					.set({ path: uploaded.filePath, width: dims?.width ?? null, height: dims?.height ?? null })
					.where(eq(images.id, record.id))
					.run();
			} catch (e) {
				await raw(db, 'DELETE FROM images WHERE id = ?', [record.id]);
				throw e;
			}
			replacements.push({ ref, id: record.id });
			console.log(`  uploaded ${ref.url} -> image ${record.id}`);
		}
		for (const { ref, id } of replacements.sort((x, y) => y.ref.start - x.ref.start)) {
			body = rewriteImageRef(body, ref, id);
		}
		if (!LIVE) continue;
		const oldRows = await q('SELECT uk FROM translations WHERE key = ?', [a.contentKey]);
		const ending = endingBlock(oldRows[0].uk);
		await db.update(translations).set({ uk: body + ending }).where(eq(translations.key, a.contentKey)).run();
		console.log(`  content updated${ending ? ' (ending preserved)' : ''}`);
	}
	console.log(touched ? (LIVE ? '\nDone.' : '\nDRY RUN — no writes. Re-run with --live.') : '\nNo articles with images.');
}

main().catch((e) => {
	console.error('FAILED:', e.message);
	process.exit(1);
});
