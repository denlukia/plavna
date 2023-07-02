import type { PageServerLoad } from './[slug]/$types';

export const postEditorLoad = (async ({ params, locals: { plavna } }) => {
	const forms = await plavna.posts.createAndOrLoadEditingForms(params.username, params.slug);

	return forms;
}) satisfies PageServerLoad;

export const postLoad = (async ({ params, locals: { plavna } }) => {
	// const response = await loadBase(params, locals);
	// return { post: response };
}) satisfies PageServerLoad;
