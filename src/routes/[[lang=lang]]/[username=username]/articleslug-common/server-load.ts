import type { PageServerLoad } from '../[articleslug=articleslug]/$types';

export const load: PageServerLoad = async ({ params, locals: { articleService } }) => {
	const { translations, ...other } = await articleService.getOne(
		params.username,
		params.articleslug
	);

	return { ...other, recordsTranslations: translations };
};
