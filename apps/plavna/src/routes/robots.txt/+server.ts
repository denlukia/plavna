export const GET = async ({ url }) => {
	const body = `User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
