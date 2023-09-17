import { type RequestEvent, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';

import { generatePath } from '$lib/isomorphic/url';
import { update_translation } from '$lib/server/common-actions';
import {
	articlePreviewUpdateSchema,
	articleSlugUpdateSchema,
	imageProviderUpdateFormSchema,
	previewTemplateCreationFormSchema,
	previewTemplateDeletionFormSchema,
	previewTemplateEditingFormSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema
} from '$lib/server/collections/parsers';

import type { RouteParams as RouteParams1 } from './[slug]/edit/$types';
import type { RouteParams as RouteParams2 } from './page-[pagename]/[slug]/edit/$types';
import { checkFileSupport, isFilePresent } from '$lib/server/utils/images';
import { ERRORS } from '$lib/isomorphic/errors';

async function switch_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, tagUpdateSchema);
	if (!form.valid) return fail(400, { form });

	const { slug } = event.params;
	const { plavna } = event.locals;
	await plavna.tags.switchChecked(form.data, slug);
}

async function create_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, translationInsertSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.tags.create(form.data);
}

async function delete_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, tagDeleteSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.tags.delete(form.data);
}

async function update_slug(event: ActionRequestEvt) {
	const { slug } = event.params;
	const form = await superValidate(event.request, articleSlugUpdateSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	const result = await plavna.articles.updateSlug(slug, form.data);

	let replacementsObject: Record<string, string | undefined> = {
		'[[lang=lang]]': event.params.lang,
		'[username]': event.params.username,
		'[slug]': result.slug
	};
	if ('pagename' in event.params) {
		replacementsObject['[pagename]'] = event.params.pagename;
	}
	throw redirect(302, generatePath(event.route.id, replacementsObject));
}

async function edit_article(event: ActionRequestEvt, type: 'publish' | 'hide' | 'delete') {
	const { slug } = event.params;
	const { plavna } = event.locals;
	await plavna.articles[type](slug);

	if (type === 'delete') {
		let destinationRouteId = '/[[lang=lang]]/[username]';
		let replacementsObject: Record<string, string | undefined> = {
			'[[lang=lang]]': event.params.lang,
			'[username]': event.params.username
		};
		if ('pagename' in event.params) {
			destinationRouteId = '/[[lang=lang]]/[username]/page-[pagename]';
			replacementsObject['[pagename]'] = event.params.pagename;
		}
		throw redirect(302, generatePath(destinationRouteId, replacementsObject));
	}
}

async function update_preview(event: ActionRequestEvt) {
	const { slug } = event.params;
	const form = await superValidate(event.request, articlePreviewUpdateSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.articles.updatePreview(slug, form.data);
}

async function create_preview_template(event: ActionRequestEvt) {
	const formData = await event.request.formData();
	const form = await superValidate(formData, previewTemplateCreationFormSchema);
	if (!form.valid) return fail(400, { form });

	const imageEntry = formData.get('image');
	let image: Buffer | null = null;
	if (isFilePresent(imageEntry)) {
		const checkResult = await checkFileSupport(imageEntry);
		if (checkResult.errors) return setError(form, 'image', checkResult.errors);
		image = checkResult.image;
	}

	const { plavna } = event.locals;
	await plavna.previewTemplates.create(form.data, image);
}

async function update_preview_template(event: ActionRequestEvt) {
	const formData = await event.request.formData();
	const form = await superValidate(formData, previewTemplateEditingFormSchema);
	if (!form.valid) return fail(400, { form });

	const imageEntry = formData.get('image');
	let image: Buffer | null = null;
	if (isFilePresent(imageEntry)) {
		const checkResult = await checkFileSupport(imageEntry);
		if (checkResult.errors) return setError(form, 'image', checkResult.errors);
		image = checkResult.image;
	}

	const { plavna } = event.locals;
	await plavna.previewTemplates.update(form.data, image);
}
async function delete_preview_template(event: ActionRequestEvt) {
	const form = await superValidate(event.request, previewTemplateDeletionFormSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.previewTemplates.delete(form.data);
}

async function update_image_provider(event: ActionRequestEvt) {
	const form = await superValidate(event.request, imageProviderUpdateFormSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	try {
		await plavna.user.updateImageProvider(form.data);
	} catch {
		return setError(form, '', ERRORS.CANNOT_ACCESS_IMAGEKIT);
	}
}
async function delete_image_provider(event: ActionRequestEvt) {
	const { plavna } = event.locals;

	await plavna.user.updateImageProvider({
		imagekit_private_key: '',
		imagekit_public_key: '',
		imagekit_url_endpoint: ''
	});
}

type ActionRequestEvt =
	| RequestEvent<RouteParams1, '/[[lang=lang]]/[username]/[slug]/edit'>
	| RequestEvent<RouteParams2, '/[[lang=lang]]/[username]/page-[pagename]/[slug]/edit'>;

export const actions = {
	update_translation,
	switch_tag,
	create_tag,
	delete_tag,
	update_slug,
	publish: (event: ActionRequestEvt) => edit_article(event, 'publish'),
	hide: (event: ActionRequestEvt) => edit_article(event, 'hide'),
	delete: (event: ActionRequestEvt) => edit_article(event, 'delete'),
	update_preview,
	create_preview_template,
	update_preview_template,
	delete_preview_template,
	update_image_provider,
	delete_image_provider
};
