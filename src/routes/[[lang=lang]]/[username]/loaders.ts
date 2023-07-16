import type { PageLoad as PostLoad, PageServerLoad as PostServerLoad } from './[slug]/$types';
import type {
	PageLoad as PostEditLoad,
	PageServerLoad as PostEditServerLoad
} from './[slug]/edit/$types';

export const postEditServerLoad = (async ({ params, parent, locals: { plavna } }) => {
	// TODO Try to remake all translations (incl forms) into one store, {forms, translations, images}
	const { translations: newTranslations, ...other } = await plavna.posts.createAndOrLoadPostEditor(
		params.username,
		params.slug
	);
	const { translations } = await parent();
	return { ...other, translations: { ...translations, ...newTranslations } };
}) satisfies PostEditServerLoad;

export const postEditLoad = (async ({ data }) => {
	const currentPreview = data.previews.find((preview) => preview.id === data.post.preview_type_id);
	const previewComponent = (
		await import(`$lib/components/previews/${currentPreview?.component_reference}Editor.svelte`)
	).default;

	return { ...data, previewComponent };
}) satisfies PostEditLoad;

export const postServerLoad = (async ({ params, locals: { plavna } }) => {
	// const response = await loadBase(params, locals);
	// return { post: response };
}) satisfies PostServerLoad;
