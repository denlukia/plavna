# Book 3 import scripts (rationality, page `b3s`)

One-off scripts that build the 3rd book ("Машина у духові") from the private
`denlukia/rationality-ua-private` repo, mirroring how books 1–2 are structured:

- 4 sections on page `b3s`; section 1 = intro block + `КН3 Вступ` + `КН3 Розділ А` tags
- one tag per chapter (`КН3 Вступ`, `КН3 Розділ А..Г`), articles linked via tags
- previews: custom `emoji-grid` template, `preview_columns = 2`,
  rows follow `3-2-2-3` in display order, a lonely last card takes 5 rows
- stub emoji `📄📄` for all previews (replace later via the editor)
- section colors: pastel brown for section 1, book-1 chapter colors for 2–4
- every article stores its GitHub blob URL in `md_source_url` for later Sync

## Files

- `config.mjs` — book definition (chapters, EN slug/number map, colors, sections, renames)
- `lib.mjs` — DB client, minimal drizzle schema, GitHub/slug/rows helpers
- `create-book3.mjs` — creates tags → articles (+translations, images,
  screenshot queue rows) → sections
- `add-next-links.mjs` — appends `## Далі:` chains (last article gets
  `## Кінець третьої книги`), mirroring books 1–2
- `reprioritize-screenshots.mjs` — resets attempts and backdates `queued_at`
  for ungenerated chapter-1 screenshots so the worker (oldest-first)
  picks them up before anything else
- `renumber-book3.mjs` — renumbers titles per-book from 1 (intro + interlude
  stay unnumbered), cancels all book-3 queue rows and enqueues fresh ones
  with the new titles (screenshot URLs embed titles)
- `rename-tags.mjs` — renames existing tags to `КН1 …` / `КН2 …`

## Usage (from `apps/plavna`)

```bash
pnpm exec node scripts/book-3/rename-tags.mjs           # dry run
pnpm exec node scripts/book-3/rename-tags.mjs --live    # rename for real
pnpm exec node scripts/book-3/create-book3.mjs          # dry run (still fetches GitHub to validate)
pnpm exec node scripts/book-3/create-book3.mjs --live   # create for real
```

Without `--live` nothing is written. Both scripts read `.env`
(`DATABASE_URL`, `DATABASE_AUTH_TOKEN`) and the stored GitHub token from
`auth_user` — tokens are never printed.

Guards: `create-book3` aborts if `КН3%` tags or `b3s` sections already exist,
or if any planned slug is taken. `rename-tags` skips tags that already match.

## After running

- Cards show the "screenshot not ready" placeholder until `screenshotter-cron`
  processes the queued rows (it needs the app's ImageKit credentials, which are
  embedded in the queue rows from `auth_user`).
- Replace stub emojis per article in the editor when ready.
- If a run fails midway, inspect what was created (tags → articles →
  sections, in that order) and delete the partial rows before re-running,
  e.g. `DELETE FROM tags WHERE user_id = '…' AND id IN (…)` (translations of
  deleted rows are cascade-safe only via article/section/tag deletes — check
  FKs before manual cleanup).
