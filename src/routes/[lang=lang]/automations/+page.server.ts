export const actions = {
	create_articles: async (event) => {
		const { translationService, tagService, articleService } = event.locals;

		const tagsQty = 3;
		const articlesPerTagQty = 11;
		for (let i = 0; i < tagsQty; i++) {
			const tag = await tagService.create({ en: `Test tag ${i + 1}` });
			console.log('Created tag ', i + 1);
			for (let n = 0; n < articlesPerTagQty; n++) {
				const { meta } = await articleService.loadEditor('den', `test-article-${n + 1}`);
				console.log(`For tag ${i + 1}: created article ${n + 1}`);
				await translationService.update({
					key: meta.title_translation_key,
					en: `Test title ${i + 1}`
				});
				console.log(`For tag ${i + 1}: updated translation fro article ${n + 1}`);
				await tagService.switchChecked({ id: tag.id, checked: false }, meta.slug);
				console.log(`Switched tag ${i + 1} on article ${n + 1}`);
			}
			console.log('\n');
		}
	}
};
