import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
import { ERRORS } from '$lib/collections/errors';
import { articleSlugUpdateSchema } from '$lib/features/article/parsers';
import type {
	ArticlePreviewImageFileFieldsAll,
	ArticlePreviewImageHandlers
} from '$lib/features/article/parsers';
import { generatePath } from '$lib/features/common/links';
import { update_translation } from '$lib/features/i18n/actions';
import { translationInsertSchema } from '$lib/features/i18n/parsers';
import { getSystemTranslationsSlice } from '$lib/features/i18n/utils';
import {
	imageCreationFormSchema,
	imageDeletionFormSchema,
	imageProviderUpdateFormSchema,
	imageUpdateFileFields,
	imageUpdateFormSchema
} from '$lib/features/image/parsers';
import { updateImages } from '$lib/features/image/updater.server';
import {
	articlePreviewImageFileFieldsAllObj,
	articlePreviewUpdateSchema,
	previewTemplateCreationFormSchema,
	previewTemplateDeletionFormSchema,
	previewTemplateEditingFormSchema
} from '$lib/features/preview/parsers';
import { tagDeleteSchema, tagUpdateSchema } from '$lib/features/tag/parsers';

import type { RequestEvent } from './$types';

async function switch_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(tagUpdateSchema));
	if (!form.valid) return fail(400, { form });

	const { articleslug } = event.params;
	const { plavna } = event.locals;
	await plavna.tags.switchChecked(form.data, articleslug);
}

async function create_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(translationInsertSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.tags.create(form.data);
}

async function delete_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(tagDeleteSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.tags.delete(form.data);
}

async function update_slug(event: RequestEvent) {
	const { articleslug } = event.params;
	const form = await superValidate(event.request, zod(articleSlugUpdateSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	const result = await plavna.articles.updateSlug(articleslug, form.data);

	const replacementsObject: Record<string, string | undefined> = {
		'[[lang=lang]]': event.params.lang,
		'[username]': event.params.username,
		'[articleslug]': result.slug
	};
	if ('pageslug' in event.params) {
		replacementsObject['[pageslug]'] = event.params.pageslug;
	}
	redirect(302, generatePath(event.route.id, replacementsObject));
}

async function edit_article(event: RequestEvent, type: 'publish' | 'hide' | 'delete') {
	const { articleslug } = event.params;
	const { plavna } = event.locals;
	await plavna.articles[type](articleslug);

	if (type === 'delete') {
		let destinationRouteId = '/[[lang=lang]]/[username]';
		const replacementsObject: Record<string, string | undefined> = {
			'[[lang=lang]]': event.params.lang,
			'[username]': event.params.username
		};
		if ('pageslug' in event.params) {
			destinationRouteId = '/[[lang=lang]]/[username]/page-[pageslug]';
			replacementsObject['[pageslug]'] = event.params.pageslug;
		}
		redirect(302, generatePath(destinationRouteId, replacementsObject));
	}
}

async function update_preview(event: RequestEvent) {
	const { articleslug } = event.params;
	const { plavna } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(articlePreviewUpdateSchema));
	if (!form.valid) return fail(400, { form });

	const imagesKeys = Object.keys(articlePreviewImageFileFieldsAllObj) as Array<
		keyof ArticlePreviewImageFileFieldsAll
	>;
	const imagesHandlers = {} as ArticlePreviewImageHandlers;
	const keysForDeletion = imagesKeys.filter(
		(key) => key.startsWith('delete') && form.data[key] === true
	);

	for (const key of imagesKeys) {
		imagesHandlers[key] = new ServerImageHandler(formData.get(key));
		const filePresent = imagesHandlers[key].checkPresence();
		if (filePresent) {
			await imagesHandlers[key].validate(IMG_VALIDATION_CONFIG);
		}
	}

	await plavna.articles.updatePreview(articleslug, form.data, imagesHandlers, keysForDeletion);
}

async function create_preview_template(event: RequestEvent) {
	const { plavna } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(previewTemplateCreationFormSchema));
	if (!form.valid) return fail(400, { form });

	const imageHandler = new ServerImageHandler(formData.get('image'));
	const filePresent = imageHandler.checkPresence();
	if (filePresent) {
		await imageHandler.validate(IMG_VALIDATION_CONFIG);
	}

	await plavna.previewTemplates.create(form.data, imageHandler);
}

async function update_preview_template(event: RequestEvent) {
	const { plavna } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(previewTemplateEditingFormSchema));
	if (!form.valid) return fail(400, { form });

	const imageHandler = new ServerImageHandler(formData.get('image'));
	const filePresent = imageHandler.checkPresence();
	if (filePresent) {
		await imageHandler.validate(IMG_VALIDATION_CONFIG);
	}

	await plavna.previewTemplates.update(form.data, imageHandler);
}
async function delete_preview_template(event: RequestEvent) {
	const form = await superValidate(event.request, zod(previewTemplateDeletionFormSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.previewTemplates.delete(form.data);
}

async function update_image_provider(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageProviderUpdateFormSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	try {
		await plavna.user.updateImageProvider(form.data);
	} catch {
		return setError(form, '', ERRORS.IMAGES.INVALID_PROVIDER_CREDS);
	}
}
async function delete_image_provider(event: RequestEvent) {
	const { plavna } = event.locals;

	await plavna.user.updateImageProvider({
		imagekit_private_key: '',
		imagekit_public_key: '',
		imagekit_url_endpoint: ''
	});
}

async function create_image(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageCreationFormSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;

	await plavna.images.create({
		owning_article_id: form.data.article_id,
		is_account_common: form.data.is_account_common
	});
}

async function update_image(event: RequestEvent) {
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(imageUpdateFormSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	const imagesKeys = Object.keys(imageUpdateFileFields);
	await updateImages({ imagesKeys, plavna, rawData: formData, data: form.data });
}

async function delete_image(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageDeletionFormSchema));
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.images.delete(form.data.id);
}

export const actions = {
	update_translation,
	switch_tag,
	create_tag,
	delete_tag,
	update_slug,
	publish: (event) => edit_article(event, 'publish'),
	hide: (event: RequestEvent) => edit_article(event, 'hide'),
	delete: (event: RequestEvent) => edit_article(event, 'delete'),
	update_preview,
	create_preview_template,
	update_preview_template,
	delete_preview_template,
	update_image_provider,
	delete_image_provider,
	create_image,
	update_image,
	delete_image
};

export const load = async ({ params, parent, locals: { plavna } }) => {
	const { translations: newTranslations, ...other } = await plavna.articles.loadEditor(
		params.username,
		params.articleslug
	);
	const { systemTranslations } = await parent();

	return {
		...other,
		systemTranslations: {
			...systemTranslations,
			...getSystemTranslationsSlice('article_editor', params.lang)
		},
		recordsTranslations: newTranslations
	};
};
