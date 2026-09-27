// Creates Book 3 records for the rationality account (page "b3s").
//
// Usage (from apps/plavna):
//   pnpm exec node scripts/book-3/create-book3.mjs           # dry run, prints plan
//   pnpm exec node scripts/book-3/create-book3.mjs --live    # writes to DB
//
// Reads .env (DATABASE_*) and the stored GitHub token from auth_user.
// Never prints tokens. Fails fast; see README for cleanup on partial runs.

import {
	articles,
	ghBlobUrl,
	ghFetchRaw,
	ghListDir,
	getActor,
	getDb,
	images,
	raw,
	rowsForPosition,
	cardDims,
	screenshots_queue,
	sections,
	sections_to_tags,
	serializeParams,
	splitTitle,
	tags,
	tags_to_articles,
	transliterate,
	translations,
	validateSlug
} from './lib.mjs';
import {
	BRANCH,
	BOOK_DIR,
	CHAPTERS,
	PAGE_SLUG,
	REPO,
	SECTIONS,
	STUB_EMOJI,
	TEMPLATE_URL_MATCH,
	USERNAME
} from './config.mjs';

const LIVE = process.argv.includes('--live');
const EM = ' ';

function fileOrderKey(name) {
	const m = name.match(/^\[(\d+)\]/);
	return m ? Number(m[1]) : 9999;
}

async function insertTranslation(db, userId, uk) {
	const rows = await db.insert(translations).values({ user_id: userId, uk: uk ?? null }).returning({ key: translations.key }).all();
	return rows[0].key;
}

async function insertImage(db, userId, source) {
	const rows = await db
		.insert(images)
		.values({ user_id: userId, is_account_common: false, source })
		.returning({ id: images.id })
		.all();
	return rows[0].id;
}

function fitSlug(base, taken) {
	let slug = base.slice(0, 64);
	const cut = slug.lastIndexOf('-');
	if (cut > 20) slug = slug.slice(0, cut);
	slug = slug.replace(/-+$/g, '');
	if (slug.length < 3) throw new Error(`Slug too short after processing: "${base}"`);
	if (!taken.has(slug)) return slug;
	for (let i = 2; i < 100; i++) {
		const suffix = `-${i}`;
		let candidate = slug.slice(0, 64 - suffix.length).replace(/-+$/g, '') + suffix;
		if (!taken.has(candidate)) return candidate;
	}
	throw new Error(`Cannot make unique slug for "${base}"`);
}

function buildIntro(letter, chapterTitle, tagIds) {
	const links = tagIds.map((id) => `[](tag:${id})`).join(' ');
	return (
		`# Раціональність: від Алгоритмів до Якорування \n` +
		`## Книга третя. Машина у духові\n` +
		`### Rationality: From AI to Zombies українською.  Переклав Данило Жирко, оформив Денис Лук'яненко.\n` +
		`\n` +
		`### [Англійською](http://lesswrong.com/rationality)${EM}[Завантажити PDF]()${EM}[Книга перша](./)${EM}[Книга друга](./rationality/page:book-2)  \n` +
		` \n` +
		`## Розділ ${letter}. ${chapterTitle} ${links}`
	);
}

async function main() {
	const db = getDb();
	const actor = await getActor(db, USERNAME);
	if (!actor.github_token) throw new Error('No GitHub token stored for rationality');
	const providerData = {
		imagekit_public_key: actor.imagekit_public_key,
		imagekit_private_key: actor.imagekit_private_key,
		imagekit_url_endpoint: actor.imagekit_url_endpoint
	};
	if (!providerData.imagekit_private_key || !providerData.imagekit_url_endpoint) {
		throw new Error('ImageKit provider credentials missing for rationality');
	}

	const pageRows = await raw(db, 'SELECT id, slug FROM pages WHERE user_id = ? AND slug = ?', [actor.id, PAGE_SLUG]);
	const pageRow = pageRows.rows[0];
	if (!pageRow) throw new Error(`Page "${PAGE_SLUG}" not found`);
	const pageId = pageRow.id;

	const tplRows = await raw(db, 'SELECT id, url FROM preview_templates WHERE user_id = ?', [actor.id]);
	const template = tplRows.rows.find((r) => String(r.url).includes(TEMPLATE_URL_MATCH));
	if (!template) throw new Error('emoji-grid preview template not found');

	// Guards: existing КН3 tags / b3s sections.
	const kn3 = await raw(
		db,
		"SELECT t.id FROM tags t JOIN translations tr ON tr.key = t.name_translation_key WHERE t.user_id = ? AND tr.uk LIKE 'КН3%'",
		[actor.id]
	);
	if (kn3.rows.length) throw new Error(`КН3 tags already exist: ${kn3.rows.map((r) => r.id).join(',')}`);
	const b3sSections = await raw(db, 'SELECT id FROM sections WHERE page_id = ?', [pageId]);
	if (b3sSections.rows.length) throw new Error(`Page "${PAGE_SLUG}" already has sections`);

	const slugRows = await raw(db, 'SELECT slug FROM articles WHERE user_id = ?', [actor.id]);
	const takenSlugs = new Set(slugRows.rows.map((r) => r.slug));

	// 1. Fetch + parse all chapters.
	const chaptersData = [];
	for (const ch of CHAPTERS) {
		const listing = await ghListDir(actor.github_token, REPO, `${BOOK_DIR}/${ch.dir}`);
		const mdFiles = listing
			.filter((f) => f.type === 'file' && f.name.endsWith('.md') && !f.name.startsWith('[000]'))
			.sort((a, b) => fileOrderKey(a.name) - fileOrderKey(b.name) || (a.name < b.name ? -1 : 1));
		if (mdFiles.length !== ch.files.length) {
			throw new Error(`Chapter "${ch.dir}": expected ${ch.files.length} files, found ${mdFiles.length}`);
		}
		const items = [];
		for (let i = 0; i < mdFiles.length; i++) {
			const f = mdFiles[i];
			const spec = ch.files[i];
			const filePath = `${BOOK_DIR}/${ch.dir}/${f.name}`;
			const text = await ghFetchRaw(actor.github_token, REPO, BRANCH, filePath);
			const { title, body } = splitTitle(text);
			if (!title) throw new Error(`No ## heading in ${filePath}`);
			let base = spec.slug || transliterate(title);
			base = base.toLowerCase();
			const slugErr = validateSlug(base.length > 64 ? base.slice(0, 64) : base);
			if (slugErr && spec.slug) throw new Error(`Bad configured slug "${spec.slug}": ${slugErr}`);
			const slug = fitSlug(base, takenSlugs);
			takenSlugs.add(slug);
			items.push({
				file: f.name,
				title: spec.no != null ? `${spec.no}. ${title}` : title,
				slug,
				body,
				mdUrl: ghBlobUrl(REPO, BRANCH, filePath)
			});
		}
		chaptersData.push({ ...ch, items });
	}

	// 2. Build plan per section (display order = chapter file order).
	let clock = Math.floor(Date.now() / 1000);
	const plan = [];
	for (const sec of SECTIONS) {
		const display = [];
		for (const ci of sec.chapters) {
			const ch = chaptersData[ci];
			for (const item of ch.items) display.push({ ...item, tag: ch.tag, colors: sec.colors });
		}
		display.forEach((item, i) => {
			item.rows = rowsForPosition(i, display.length);
			item.pub = clock--;
			item.sectionTitle = sec.chapterTitle;
		});
		plan.push({ ...sec, display });
	}

	// 3. Report.
	let totalArticles = 0;
	for (const sec of plan) {
		console.log(`\n== Section "${sec.chapterTitle}" tags=[${sec.tags.join(', ')}] color=${sec.colors.bg}`);
		for (const a of sec.display) {
			totalArticles++;
			console.log(`   rows=${a.rows} pub=${a.pub} slug=${a.slug} tag=${a.tag} title=${a.title.slice(0, 50)}`);
		}
	}
	console.log(`\nTotal articles: ${totalArticles}`);
	if (!LIVE) {
		console.log('\nDRY RUN — no writes. Re-run with --live to execute.');
		return;
	}

	// 4. Create tags.
	const tagIds = {};
	for (const ch of chaptersData) {
		const key = await insertTranslation(db, actor.id, ch.tag);
		const rows = await db.insert(tags).values({ user_id: actor.id, name_translation_key: key }).returning({ id: tags.id }).all();
		tagIds[ch.tag] = rows[0].id;
		console.log(`tag "${ch.tag}" -> ${rows[0].id}`);
	}

	// 5. Create articles + images + queue rows.
	for (const sec of plan) {
		for (const a of sec.display) {
			const titleKey = await insertTranslation(db, actor.id, a.title);
			const descKey = await insertTranslation(db, actor.id, null);
			const contentKey = await insertTranslation(db, actor.id, a.body);
			const pt1 = await insertTranslation(db, actor.id, null);
			const pt2 = await insertTranslation(db, actor.id, null);
			const img1 = await insertImage(db, actor.id, 'imagekit');
			const img2 = await insertImage(db, actor.id, 'imagekit');
			const shot = await insertImage(db, actor.id, 'imagekit');
			const shotIn = await insertImage(db, actor.id, 'imagekit');
			const inserted = await db
				.insert(articles)
				.values({
					user_id: actor.id,
					slug: a.slug,
					title_translation_key: titleKey,
					description_translation_key: descKey,
					content_translation_key: contentKey,
					publish_time: new Date(a.pub * 1000),
					preview_columns: 2,
					preview_rows: a.rows,
					preview_family: 'custom',
					preview_template_id: template.id,
					preview_translation_1_key: pt1,
					preview_translation_2_key: pt2,
					preview_image_1_id: img1,
					preview_image_2_id: img2,
					preview_screenshot_image_id: shot,
					preview_screenshot_in_article_image_id: shotIn,
					preview_prop_1: a.colors.bg,
					preview_prop_2: a.colors.text,
					preview_prop_3: a.colors.base,
					preview_prop_4: STUB_EMOJI,
					md_source_url: a.mdUrl
				})
				.returning({ id: articles.id })
				.all();
			const articleId = inserted[0].id;
			await db.insert(tags_to_articles).values({ tag_id: tagIds[a.tag], article_id: articleId }).run();
			const card = cardDims(2, a.rows);
			const opened = cardDims(5, 5);
			const params = {
				title_translation: a.title,
				description_translation: null,
				rows: a.rows,
				cols: 2,
				likes_count: 0,
				lang: 'uk',
				publish_time: new Date(a.pub * 1000),
				prop_1: a.colors.bg,
				prop_2: a.colors.text,
				prop_3: a.colors.base,
				prop_4: STUB_EMOJI,
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
					{ image_id: shot, width: card.width, height: card.height, url: serializeParams(template.url, params), lang: 'uk', imageProviderData: providerData },
					{ image_id: shotIn, width: opened.width, height: opened.height, url: serializeParams(template.url, params), lang: 'uk', imageProviderData: providerData }
				])
				.run();
			console.log(`article ${articleId} ${a.slug} rows=${a.rows}`);
		}
	}

	// 6. Create sections.
	for (const sec of plan) {
		const tagIdsForSec = sec.tags.map((t) => tagIds[t]);
		const links = tagIdsForSec.map((id) => `[](tag:${id})`).join(' ');
		const text = sec.intro
			? buildIntro(sec.letter, sec.chapterTitle, tagIdsForSec)
			: `## Розділ ${sec.letter}. ${sec.chapterTitle} ${links}`;
		const key = await insertTranslation(db, actor.id, text);
		const srows = await db
			.insert(sections)
			.values({ user_id: actor.id, page_id: pageId, title_translation_key: key })
			.returning({ id: sections.id })
			.all();
		for (const tagId of tagIdsForSec) {
			await db.insert(sections_to_tags).values({ section_id: srows[0].id, tag_id: tagId, lang: 'uk' }).run();
		}
		console.log(`section ${srows[0].id} "${sec.chapterTitle}"`);
	}
	console.log('\nDone. Screenshots will be processed by screenshotter-cron.');
}

main().catch((e) => {
	console.error('FAILED:', e.message);
	process.exit(1);
});
