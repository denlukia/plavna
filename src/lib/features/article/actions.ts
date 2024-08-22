import { error } from 'console';
import { redirect } from '@sveltejs/kit';

import type { RequestEvent as ArticleRequestEvent } from '../../../routes/[lang=lang]/[username]/[[pageslug=pageslug]]/[articleslug]/edit/$types';
import type { RequestEvent as ArticlesListRequestEvent } from '../../../routes/[lang=lang]/[username]/articles/$types';
import { generatePath } from '../common/links';

export async function edit_article(
	event: ArticleRequestEvent | ArticlesListRequestEvent,
	type: 'publish' | 'hide' | 'delete'
) {
	const params = event.params;
	const { articleService } = event.locals;

	const formData = await event.request.formData();
	const articleslugFromForm = formData.get('articleslug');

	if (typeof articleslugFromForm === 'string') {
		await articleService[type](articleslugFromForm);
	} else if ('articleslug' in params && params.articleslug) {
		await articleService[type](params.articleslug);
	} else {
		error(500);
	}

	if (type === 'delete') {
		redirect(302, generatePath('/[lang]/[username]/[pageslug]', params));
	}
}
