import { eq, isNotNull } from 'drizzle-orm';
import { table_articles } from '$lib/article/schema';
import { PAGE_SLUG_PREFIX } from '$lib/common/config';
import { db } from '$lib/db/db';
import { table_pages } from '$lib/page/schema';
import { table_users } from '$lib/user/schema';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET = async ({ url }) => {
	const origin = url.origin;

	const [users, pages, articles] = await Promise.all([
		db.select({ username: table_users.username }).from(table_users).all(),
		db
			.select({ username: table_users.username, slug: table_pages.slug })
			.from(table_pages)
			.innerJoin(table_users, eq(table_pages.user_id, table_users.id))
			.all(),
		db
			.select({ username: table_users.username, slug: table_articles.slug })
			.from(table_articles)
			.innerJoin(table_users, eq(table_articles.user_id, table_users.id))
			.where(isNotNull(table_articles.publish_time))
			.all()
	]);

	const urls = new Set<string>();
	urls.add(`${origin}/`);
	for (const user of users) {
		urls.add(`${origin}/${encodeURIComponent(user.username)}`);
	}
	for (const page of pages) {
		if (!page.slug) continue;
		urls.add(
			`${origin}/${encodeURIComponent(page.username)}/${PAGE_SLUG_PREFIX}${encodeURIComponent(page.slug)}`
		);
	}
	for (const article of articles) {
		urls.add(
			`${origin}/${encodeURIComponent(article.username)}/${encodeURIComponent(article.slug)}`
		);
	}

	const body =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		[...urls].map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`).join('\n') +
		`\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
