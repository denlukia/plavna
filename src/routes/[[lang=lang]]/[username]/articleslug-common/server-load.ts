import type { PageServerLoad } from '../[articleslug]/$types';

export const load = (async ({ params, locals: { articleService } }) => {
	const { translations, ...other } = await articleService.getOne(
		params.username,
		params.articleslug
	);

	return { ...other, recordsTranslations: translations };
}) satisfies PageServerLoad;
