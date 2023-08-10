export const actions = {
	default: async (event) => {
		const { plavna } = event.locals;

		const tagsQty = 3;
		const articlesPerTagQty = 11;
		for (let i = 0; i < tagsQty; i++) {
			const tag = await plavna.tags.create({ en: `Test tag ${i + 1}` });
			console.log('Created tag ', i + 1);
			for (let n = 0; n < articlesPerTagQty; n++) {
				const { post } = await plavna.posts.createAndOrLoadEditor('den', `test-post-${n + 1}`);
				console.log(`For tag ${i + 1}: created post ${n + 1}`);
				await plavna.translations.update({
					_id: post.title_translation_id,
					en: `Test title ${i + 1}`
				});
				console.log(`For tag ${i + 1}: updated translation fro post ${n + 1}`);
				await plavna.tags.switchChecked({ id: tag.id, checked: false }, post.slug);
				console.log(`Switched tag ${i + 1} on post ${n + 1}`);
			}
			console.log('\n');
		}
	}
};
