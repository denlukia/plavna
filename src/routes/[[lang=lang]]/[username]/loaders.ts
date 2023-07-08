import type { PageLoad as PostLoad, PageServerLoad as PostServerLoad } from './[slug]/$types';
import type {
	PageLoad as PostEditLoad,
	PageServerLoad as PostEditServerLoad
} from './[slug]/edit/$types';

export const postEditServerLoad = (async ({ params, locals: { plavna } }) => {
	const forms = await plavna.posts.createAndOrLoadEditingForms(params.username, params.slug);

	return forms;
}) satisfies PostEditServerLoad;

export const postEditLoad = (async ({ data }) => {
	const currentPreview = data.previews.find((preview) => preview.id === data.currentPreviewId);
	const previewComponent = (
		await import(`$lib/components/previews/${currentPreview?.component_reference}Editor.svelte`)
	).default;
	return { ...data, previewComponent };
}) satisfies PostEditLoad;

export const postServerLoad = (async ({ params, locals: { plavna } }) => {
	// const response = await loadBase(params, locals);
	// return { post: response };
}) satisfies PostServerLoad;
