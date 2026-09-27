// Renumbers Book 3 article titles per-book starting at 1 (intro and the
// interlude stay unnumbered, like book 1), then replaces ALL book-3
// screenshot queue rows with fresh ones (screenshot URLs embed the title).
//
// Usage (from apps/plavna):
//   pnpm exec node scripts/book-3/renumber-book3.mjs           # dry run
//   pnpm exec node scripts/book-3/renumber-book3.mjs --live    # writes to DB

import { getActor, getDb, raw, cardDims, serializeParams, articles, translations, screenshots_queue } from './lib.mjs';
import { and, desc, eq, like } from 'drizzle-orm';
import { USERNAME, TEMPLATE_URL_MATCH } from './config.mjs';

const LIVE = process.argv.includes('--live');
// Intro + interlude stay unnumbered (book-1 convention).
const UNNUMBERED_SLUGS = new Set(['minds-an-introduction', 'the-power-of-intelligence']);

async function main() {
	const db = getDb();
	const actor = await getActor(db, USERNAME);
	const q = async (sql, args = []) => (await raw(db, sql, args)).rows;

	const chain = await db
		.select({
			id: articles.id,
			slug: articles.slug,
			titleKey: articles.title_translation_key,
			title: translations.uk,
			cols: articles.preview_columns,
			rows: articles.preview_rows,
			tplId: articles.preview_template_id,
			p1: articles.preview_prop_1,
			p2: articles.preview_prop_2,
			p3: articles.preview_prop_3,
			p4: articles.preview_prop_4,
			pub: articles.publish_time,
			shot: articles.preview_screenshot_image_id,
			shotIn: articles.preview_screenshot_in_article_image_id
		})
		.from(articles)
		.innerJoin(translations, eq(translations.key, articles.title_translation_key))
		.where(and(eq(articles.user_id, actor.id), like(articles.md_source_url, '%rationality-ua-private%')))
		.orderBy(desc(articles.publish_time))
		.all();
	if (!chain.length) throw new Error('No book-3 articles found');

	const tplRows = await q('SELECT id, url FROM preview_templates WHERE user_id = ?', [actor.id]);
	const template = tplRows.find((r) => String(r.url).includes(TEMPLATE_URL_MATCH));
	if (!template) throw new Error('emoji-grid preview template not found');
	const providerData = {
		imagekit_public_key: actor.imagekit_public_key,
		imagekit_private_key: actor.imagekit_private_key,
		imagekit_url_endpoint: actor.imagekit_url_endpoint
	};

	// 1. Compute new titles.
	let n = 0;
	const plan = chain.map((a) => {
		const stripped = (a.title || '').replace(/^\d+\.\s+/, '');
		if (UNNUMBERED_SLUGS.has(a.slug)) return { ...a, stripped, next: stripped };
		n++;
		return { ...a, stripped, next: `${n}. ${stripped}` };
	});
	console.log(`articles: ${chain.length}, numbered 1..${n}`);
	for (const a of plan) {
		if (a.next !== a.title) console.log(`  ${a.slug}: "${a.title}" -> "${a.next}"`);
	}

	// 2. Queue replacement preview.
	const imageIds = [...new Set(plan.flatMap((a) => [a.shot, a.shotIn]))];
	const existing = await q(
		`SELECT COUNT(*) c FROM screenshots_queue WHERE image_id IN (${imageIds.map(() => '?').join(',')})`,
		imageIds
	);
	console.log(`\nqueue rows to cancel: ${existing[0].c}, to enqueue: ${imageIds.length * 1} (2 per article: ${imageIds.length / 2} articles x 2)`);
	if (!LIVE) {
		console.log('\nDRY RUN — no writes. Re-run with --live.');
		return;
	}

	// 3. Apply title updates.
	for (const a of plan) {
		if (a.next !== a.title) {
			await db.update(translations).set({ uk: a.next }).where(eq(translations.key, a.titleKey)).run();
		}
	}

	// 4. Cancel old queue rows, enqueue fresh ones with new titles.
	await raw(
		db,
		`DELETE FROM screenshots_queue WHERE image_id IN (${imageIds.map(() => '?').join(',')})`,
		imageIds
	);
	const opened = cardDims(5, 5);
	for (const a of plan) {
		const card = cardDims(a.cols, a.rows);
		const params = {
			title_translation: a.next,
			description_translation: null,
			rows: a.rows,
			cols: a.cols,
			likes_count: 0,
			lang: 'uk',
			publish_time: a.pub,
			prop_1: a.p1,
			prop_2: a.p2,
			prop_3: a.p3,
			prop_4: a.p4,
			translation_1: null,
			translation_2: null,
			img_1: null,
			img_2: null,
			url: null,
			tags: []
		};
		await db
			.insert(screenshots_queue)
			.values([
				{ image_id: a.shot, width: card.width, height: card.height, url: serializeParams(template.url, params), lang: 'uk', imageProviderData: providerData },
				{ image_id: a.shotIn, width: opened.width, height: opened.height, url: serializeParams(template.url, params), lang: 'uk', imageProviderData: providerData }
			])
			.run();
	}
	console.log('\nDone — titles updated, queue replaced.');
}

main().catch((e) => {
	console.error('FAILED:', e.message);
	process.exit(1);
});
