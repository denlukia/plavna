// Reprioritizes ungenerated Book 3 Chapter 1 screenshots (tags КН3 Вступ,
// КН3 Розділ А): resets attempts and backdates queued_at so the worker
// (which claims oldest-first) picks them up before anything else.
//
// Usage (from apps/plavna):
//   pnpm exec node scripts/book-3/reprioritize-screenshots.mjs           # dry run
//   pnpm exec node scripts/book-3/reprioritize-screenshots.mjs --live    # writes to DB

import { getActor, getDb, raw } from './lib.mjs';
import { USERNAME } from './config.mjs';

const LIVE = process.argv.includes('--live');

async function main() {
	const db = getDb();
	const actor = await getActor(db, USERNAME);
	const q = async (sql, args = []) => (await raw(db, sql, args)).rows;

	const articles = await q(
		`SELECT DISTINCT a.id, a.slug, a.preview_screenshot_image_id s1, a.preview_screenshot_in_article_image_id s2
		 FROM articles a
		 JOIN tags_to_articles tta ON tta.article_id = a.id
		 JOIN tags t ON t.id = tta.tag_id
		 JOIN translations tr ON tr.key = t.name_translation_key
		 WHERE a.user_id = ? AND tr.uk IN ('КН3 Вступ', 'КН3 Розділ А')`,
		[actor.id]
	);
	const imageIds = [...new Set(articles.flatMap((a) => [a.s1, a.s2]))];
	const generated = new Set(
		(
			await q(
				`SELECT id FROM images WHERE id IN (${imageIds.map(() => '?').join(',')}) AND (path IS NOT NULL OR path_translation_key IS NOT NULL)`,
				imageIds
			)
		).map((r) => r.id)
	);
	const pending = imageIds.filter((id) => !generated.has(id));
	console.log(`ch1 screenshot images: ${imageIds.length}, generated: ${generated.size}, pending: ${pending.length}`);
	if (!pending.length) {
		console.log('Nothing to reprioritize.');
		return;
	}
	const rows = await q(
		`SELECT id, image_id, width, processing_attempts FROM screenshots_queue WHERE image_id IN (${pending.map(() => '?').join(',')}) ORDER BY id`,
		pending
	);
	console.log(`queue rows to reset+backdate: ${rows.length}`);
	for (const r of rows) console.log(`  queue=${r.id} image=${r.image_id} w=${r.width} attempts=${r.processing_attempts}`);
	if (!LIVE) {
		console.log('\nDRY RUN — no writes. Re-run with --live.');
		return;
	}
	await q(
		`UPDATE screenshots_queue SET processing_attempts = 0, processing_running = 0, processing_started_at = NULL, queued_at = 1 WHERE image_id IN (${pending.map(() => '?').join(',')})`,
		pending
	);
	console.log('\nDone — these rows now sort first (oldest queued_at).');
}

main().catch((e) => {
	console.error('FAILED:', e.message);
	process.exit(1);
});
