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
	const { tagService } = event.locals;
	await tagService.switchChecked(form.data, articleslug);
}

async function create_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(translationInsertSchema));
	if (!form.valid) return fail(400, { form });

	const { tagService } = event.locals;
	await tagService.create(form.data);
}

async function delete_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(tagDeleteSchema));
	if (!form.valid) return fail(400, { form });

	const { tagService } = event.locals;
	await tagService.delete(form.data);
}

async function update_slug(event: RequestEvent) {
	const { articleslug } = event.params;
	const form = await superValidate(event.request, zod(articleSlugUpdateSchema));
	if (!form.valid) return fail(400, { form });

	const { articleService } = event.locals;
	const result = await articleService.updateSlug(articleslug, form.data);

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
	const { articleService } = event.locals;
	await articleService[type](articleslug);

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
	const { articleService } = event.locals;
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
		const entry = formData.get(key);
		if (entry) {
			try {
				imagesHandlers[key] = await new ServerImageHandler().setImageFromEntry(
					entry,
					IMG_VALIDATION_CONFIG
				);
			} catch (error) {}
		} else {
			imagesHandlers[key] = null;
		}
	}

	await articleService.updatePreview(articleslug, form.data, imagesHandlers, keysForDeletion);
}

async function create_preview_template(event: RequestEvent) {
	const { previewService } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(previewTemplateCreationFormSchema));
	if (!form.valid) return fail(400, { form });

	const entry = formData.get('image');
	let imageHandler: ServerImageHandler | null = null;
	if (entry) {
		try {
			imageHandler = await new ServerImageHandler().setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
		} catch (error) {
			// TODO: Error for unsupported image
			return fail(400, { form });
		}
	}

	await previewService.create(form.data, imageHandler);
}

async function update_preview_template(event: RequestEvent) {
	const { previewService } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(previewTemplateEditingFormSchema));
	if (!form.valid) return fail(400, { form });

	const entry = formData.get('image');
	let imageHandler: ServerImageHandler | null = null;
	if (entry) {
		try {
			imageHandler = await new ServerImageHandler().setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
		} catch (error) {
			// TODO: Error for unsupported image
			return fail(400, { form });
		}
	}

	await previewService.update(form.data, imageHandler);
}
async function delete_preview_template(event: RequestEvent) {
	const form = await superValidate(event.request, zod(previewTemplateDeletionFormSchema));
	if (!form.valid) return fail(400, { form });

	const { previewService } = event.locals;
	await previewService.delete(form.data);
}

async function update_image_provider(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageProviderUpdateFormSchema));
	if (!form.valid) return fail(400, { form });

	const { actorService } = event.locals;
	try {
		await actorService.updateImageProvider(form.data);
	} catch {
		return setError(form, '', ERRORS.IMAGES.INVALID_PROVIDER_CREDS);
	}
}
async function delete_image_provider(event: RequestEvent) {
	const { actorService } = event.locals;

	await actorService.updateImageProvider({
		imagekit_private_key: '',
		imagekit_public_key: '',
		imagekit_url_endpoint: ''
	});
}

async function create_image(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageCreationFormSchema));
	if (!form.valid) return fail(400, { form });

	const { imageService } = event.locals;

	await imageService.create({
		owning_article_id: form.data.article_id,
		is_account_common: form.data.is_account_common
	});
}

async function update_image(event: RequestEvent) {
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(imageUpdateFormSchema));
	if (!form.valid) return fail(400, { form });

	const { imageService } = event.locals;
	const imagesKeys = Object.keys(imageUpdateFileFields);
	await updateImages({ imagesKeys, imageService, rawData: formData, data: form.data });
}

async function delete_image(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageDeletionFormSchema));
	if (!form.valid) return fail(400, { form });

	const { imageService } = event.locals;
	await imageService.delete(form.data.id);
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

export const load = async ({ params, parent, locals: { articleService } }) => {
	const { translations: newTranslations, ...other } = await articleService.loadEditor(
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
