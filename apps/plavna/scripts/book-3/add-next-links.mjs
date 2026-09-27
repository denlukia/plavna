// Appends "## Далі: [title](./slug)" chains to Book 3 articles (rationality),
// mirroring books 1-2. The very last article gets "## Кінець третьої книги".
//
// Chain order = display order (publish_time DESC). Link text uses the
// unnumbered title (books 1-2 strip the "NNN. " prefix in Далі links).
//
// Usage (from apps/plavna):
//   pnpm exec node scripts/book-3/add-next-links.mjs           # dry run
//   pnpm exec node scripts/book-3/add-next-links.mjs --live    # writes to DB

import { getActor, getDb, translations, articles } from './lib.mjs';
import { and, desc, eq, like } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { USERNAME } from './config.mjs';

const LIVE = process.argv.includes('--live');
const contentTranslations = alias(translations, 'content_translations');

async function main() {
	const db = getDb();
	const actor = await getActor(db, USERNAME);

	const chain = await db
		.select({
			id: articles.id,
			slug: articles.slug,
			contentKey: articles.content_translation_key,
			title: translations.uk,
			content: contentTranslations.uk
		})
		.from(articles)
		.innerJoin(translations, eq(translations.key, articles.title_translation_key))
		.innerJoin(contentTranslations, eq(contentTranslations.key, articles.content_translation_key))
		.where(and(eq(articles.user_id, actor.id), like(articles.md_source_url, '%rationality-ua-private%')))
		.orderBy(desc(articles.publish_time))
		.all();
	if (!chain.length) throw new Error('No book-3 articles found');
	console.log(`Chain length: ${chain.length}`);

	const unnumbered = (title) => title.replace(/^\d+\.\s+/, '');

	for (const a of chain) {
		if (/## Далі:.*$/s.test(a.content) || a.content.includes('## Кінець третьої книги')) {
			throw new Error(`Article ${a.slug} already has an ending — aborting (idempotency guard)`);
		}
	}

	for (let i = 0; i < chain.length; i++) {
		const a = chain[i];
		const ending =
			i < chain.length - 1
				? `\n\n## Далі: [${unnumbered(chain[i + 1].title)}](./${chain[i + 1].slug})`
				: `\n\n## Кінець третьої книги`;
		console.log(`${a.slug}  +  ${ending.slice(0, 80)}${ending.length > 80 ? '…' : ''}`);
		if (LIVE) {
			const next = (a.content || '').trimEnd() + ending;
			await db.update(translations).set({ uk: next }).where(eq(translations.key, a.contentKey)).run();
		}
	}
	console.log(LIVE ? '\nDone.' : '\nDRY RUN — no writes. Re-run with --live.');
}

main().catch((e) => {
	console.error('FAILED:', e.message);
	process.exit(1);
});
