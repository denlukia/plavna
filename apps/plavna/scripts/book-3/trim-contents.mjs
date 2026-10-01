// Trims leading blank lines of Book 3 article contents (translation rows
// only — previews and screenshot queue are untouched).
//
// Usage (from apps/plavna):
//   pnpm exec node scripts/book-3/trim-contents.mjs           # dry run
//   pnpm exec node scripts/book-3/trim-contents.mjs --live    # writes to DB

import { getActor, getDb, translations } from './lib.mjs';
import { and, eq, like } from 'drizzle-orm';
import { USERNAME } from './config.mjs';
import { articles } from './lib.mjs';

const LIVE = process.argv.includes('--live');

async function main() {
	const db = getDb();
	const actor = await getActor(db, USERNAME);

	const rows = await db
		.select({ key: articles.content_translation_key, slug: articles.slug, uk: translations.uk })
		.from(articles)
		.innerJoin(translations, eq(translations.key, articles.content_translation_key))
		.where(and(eq(articles.user_id, actor.id), like(articles.md_source_url, '%rationality-ua-private%')))
		.all();

	const pending = rows
		.map((r) => ({ ...r, trimmed: (r.uk || '').replace(/^(?:[ \t]*\r?\n)+/, '') }))
		.filter((r) => r.trimmed !== r.uk);
	console.log(`articles: ${rows.length}, need trim: ${pending.length}`);
	for (const r of pending) console.log(`  ${r.slug}`);
	if (!LIVE) {
		console.log(pending.length ? '\nDRY RUN — no writes. Re-run with --live.' : '\nNothing to do.');
		return;
	}
	for (const r of pending) {
		await db.update(translations).set({ uk: r.trimmed }).where(eq(translations.key, r.key)).run();
	}
	console.log('\nDone — content translations only, previews untouched.');
}

main().catch((e) => {
	console.error('FAILED:', e.message);
	process.exit(1);
});
