export const load = async ({ params, locals: { plavna } }) => {
	const { translations, ...other } = await plavna.articles.getOne(
		params.username,
		params.articleslug
	);

	return { ...other, recordsTranslations: translations };
};
