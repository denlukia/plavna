import { ServerImageHandler } from '@denlukia/plavna-common/image-handler';
import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
import { ERRORS } from '$lib/collections/errors';
import { edit_article } from '$lib/features/article/actions';
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
	if (!form.valid) fail(400, { form });

	const { articleslug } = event.params;
	const { tagService } = event.locals;
	try {
		await tagService.switchChecked(form.data, articleslug);
		form.data.checked = !form.data.checked;
	} catch {
		// TODO: Error
	}

	return { form };
}

async function create_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(translationInsertSchema));
	if (!form.valid) fail(400, { form });

	const { tagService } = event.locals;
	await tagService.create(form.data);

	return { form };
}

async function delete_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(tagDeleteSchema));
	if (!form.valid) fail(400, { form });

	const { tagService } = event.locals;
	await tagService.delete(form.data);

	return { form };
}

async function update_slug(event: RequestEvent) {
	const params = event.params;
	const { articleslug } = params;
	const form = await superValidate(event.request, zod(articleSlugUpdateSchema));
	if (!form.valid) fail(400, { form });

	const { articleService } = event.locals;
	const result = await articleService.updateSlug(articleslug, form.data);

	redirect(
		302,
		generatePath('/[lang]/[username]/[prefixedpageslug]/[articleslug]/edit', params, {
			articleslug: result.slug
		})
	);
}

async function update_preview(event: RequestEvent) {
	const { articleslug } = event.params;
	const { articleService } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(articlePreviewUpdateSchema));
	if (!form.valid) fail(400, { form });

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
				const imageHandler = await new ServerImageHandler();
				await imageHandler.setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
				imagesHandlers[key] = imageHandler;
			} catch (error) {
				// TODO: Error for unsupported image
				fail(400, { form });
			}
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
	if (!form.valid) fail(400, { form });

	const entry = formData.get('image');
	let imageHandler: ServerImageHandler | null = null;
	if (entry) {
		try {
			imageHandler = await new ServerImageHandler();
			await imageHandler.setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
		} catch (error) {
			// TODO: Error for unsupported image
			fail(400, { form });
		}
	}

	await previewService.create(form.data, imageHandler);
}

async function update_preview_template(event: RequestEvent) {
	const { previewService } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(previewTemplateEditingFormSchema));
	if (!form.valid) fail(400, { form });

	const entry = formData.get('image');
	let imageHandler: ServerImageHandler | null = null;
	if (entry) {
		try {
			imageHandler = await new ServerImageHandler();
			await imageHandler.setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
		} catch (error) {
			// TODO: Error for unsupported image
			fail(400, { form });
		}
	}

	await previewService.update(form.data, imageHandler);
}
async function delete_preview_template(event: RequestEvent) {
	const form = await superValidate(event.request, zod(previewTemplateDeletionFormSchema));
	if (!form.valid) fail(400, { form });

	const { previewService } = event.locals;
	await previewService.delete(form.data);
}

async function update_image_provider(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageProviderUpdateFormSchema));
	if (!form.valid) fail(400, { form });

	const { actorService } = event.locals;
	try {
		await actorService.updateImageProvider(form.data);
		return { form };
	} catch {
		return setError(form, '', ERRORS.IMAGES.INVALID_PROVIDER_CREDS);
	}
}
async function delete_image_provider(event: RequestEvent) {
	const form = await superValidate(zod(imageProviderUpdateFormSchema));

	const { actorService } = event.locals;

	await actorService.deleteImageProvider();

	return { form };
}

async function create_image(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageCreationFormSchema));
	if (!form.valid) fail(400, { form });

	const { imageService } = event.locals;

	const { article_id } = form.data;

	await imageService.createRecord({
		owning_article_id: article_id,
		is_account_common: typeof article_id !== 'number'
	});
}

async function update_image(event: RequestEvent) {
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(imageUpdateFormSchema));
	if (!form.valid) fail(400, { form });

	const { imageService, actorService } = event.locals;

	const actor = await actorService.getOrThrow();

	const imagesKeys = Object.keys(imageUpdateFileFields);

	await updateImages({ imagesKeys, imageService, rawData: formData, data: form.data, actor });
}

async function delete_image(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageDeletionFormSchema));
	if (!form.valid) fail(400, { form });

	const { imageService } = event.locals;
	await imageService.deleteRecord(form.data.id);
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
