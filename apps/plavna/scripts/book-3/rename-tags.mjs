// Renames rationality's tag translations to the КН{book} scheme.
//
// Usage (from apps/plavna):
//   pnpm exec node scripts/book-3/rename-tags.mjs           # dry run, prints plan
//   pnpm exec node scripts/book-3/rename-tags.mjs --live    # writes to DB
//
// Only touches translations.uk of the listed tag name keys. Section descriptions
// reference tags by id, so they are unaffected.

import { eq } from 'drizzle-orm';
import { RENAMES } from './config.mjs';
import { USERNAME } from './config.mjs';
import { getActor, getDb, tags, translations } from './lib.mjs';

const LIVE = process.argv.includes('--live');

async function main() {
	const db = getDb();
	const actor = await getActor(db, USERNAME);

	const tagRows = await db
		.select({ id: tags.id, nameKey: tags.name_translation_key, uk: translations.uk })
		.from(tags)
		.innerJoin(translations, eq(translations.key, tags.name_translation_key))
		.where(eq(tags.user_id, actor.id))
		.all();
	const byId = new Map(tagRows.map((t) => [t.id, t]));

	let pending = 0;
	for (const [idStr, next] of Object.entries(RENAMES)) {
		const id = Number(idStr);
		const tag = byId.get(id);
		if (!tag) throw new Error(`Tag ${id} not found for ${USERNAME}`);
		if (tag.uk === next) {
			console.log(`tag ${id}: already "${next}" — skip`);
			continue;
		}
		console.log(`tag ${id}: "${tag.uk}" -> "${next}"`);
		pending++;
		if (LIVE) {
			await db.update(translations).set({ uk: next }).where(eq(translations.key, tag.nameKey)).run();
		}
	}
	console.log(pending ? (LIVE ? `\nRenamed ${pending} tags.` : `\nDRY RUN — ${pending} renames pending. Re-run with --live.`) : '\nNothing to do.');
}

main().catch((e) => {
	console.error('FAILED:', e.message);
	process.exit(1);
});
