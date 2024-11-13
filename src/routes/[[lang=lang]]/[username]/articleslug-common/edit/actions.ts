import { ServerImageHandler } from '@denlukia/plavna-common/images';
import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
import { ERRORS } from '$lib/collections/errors';
import { edit_article } from '$lib/features/article/actions';
import {
	articleSlugUpdateSchema,
	type ArticlePreviewImageFileFieldsAll,
	type ArticlePreviewImageHandlers
} from '$lib/features/article/parsers';
import { generatePath } from '$lib/features/common/links';
import { getActionFailure } from '$lib/features/error/fail-with-form-error';
import { createTranslationUpdater } from '$lib/features/i18n/actions';
import {
	translationInsertSchema,
	translationUpdateAllowEmptySchema,
	translationUpdateSchema
} from '$lib/features/i18n/parsers';
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

import type { Actions, RequestEvent } from '../../[articleslug]/edit/$types';

async function switch_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(tagUpdateSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

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
	if (!form.valid) {
		return fail(400, { form });
	}

	const { tagService } = event.locals;
	await tagService.create(form.data);

	return { form };
}

async function delete_tag(event: RequestEvent) {
	const form = await superValidate(event.request, zod(tagDeleteSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const { tagService } = event.locals;
	await tagService.delete(form.data);

	return { form };
}

async function update_slug(event: RequestEvent) {
	const params = event.params;
	const { articleslug } = params;
	const form = await superValidate(event.request, zod(articleSlugUpdateSchema));

	if (!form.valid) {
		return fail(400, { form });
	}

	const { articleService } = event.locals;
	let newSlug: null | string = null;

	try {
		const result = await articleService.updateSlug(articleslug, form.data);
		newSlug = result.slug;
	} catch (e) {
		return getActionFailure(e, form, 'slug');
	}

	if (newSlug) {
		redirect(
			302,
			generatePath('/[lang]/[username]/[pageslug]/[articleslug]/edit', params, {
				articleslug: newSlug
			})
		);
	}
}

async function update_preview(event: RequestEvent) {
	const { articleslug } = event.params;
	const { articleService } = event.locals;
	const formData = await event.request.formData();
	const form = await superValidate(formData, zod(articlePreviewUpdateSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const imagesKeys = Object.keys(articlePreviewImageFileFieldsAllObj) as Array<
		keyof ArticlePreviewImageFileFieldsAll
	>;
	const imagesHandlers = {} as ArticlePreviewImageHandlers;
	const keysForDeletion = imagesKeys.filter(
		(key) => key.startsWith('delete') && form.data[key] === true
	);

	for (const key of imagesKeys) {
		const entry = formData.get(key);
		if (entry instanceof File && entry.size > 0) {
			try {
				const imageHandler = await new ServerImageHandler();
				await imageHandler.setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
				imagesHandlers[key] = imageHandler;
			} catch (e) {
				// TODO: Error for unsupported image
				return fail(400, { form });
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
	if (!form.valid) {
		return fail(400, { form });
	}

	const entry = formData.get('image');
	let imageHandler: ServerImageHandler | null = null;
	if (entry instanceof File && entry.size > 0) {
		try {
			imageHandler = await new ServerImageHandler();
			await imageHandler.setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
		} catch {
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
	if (!form.valid) {
		return fail(400, { form });
	}

	const entry = formData.get('image');
	let imageHandler: ServerImageHandler | null = null;
	if (entry instanceof File && entry.size > 0) {
		try {
			imageHandler = await new ServerImageHandler();
			await imageHandler.setImageFromEntry(entry, IMG_VALIDATION_CONFIG);
		} catch {
			// TODO: Error for unsupported image
			return fail(400, { form });
		}
	}

	await previewService.update(form.data, imageHandler);
}
async function delete_preview_template(event: RequestEvent) {
	const form = await superValidate(event.request, zod(previewTemplateDeletionFormSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const { previewService } = event.locals;
	await previewService.delete(form.data);
}

async function update_image_provider(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageProviderUpdateFormSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

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
	if (!form.valid) {
		return fail(400, { form });
	}

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
	if (!form.valid) {
		return fail(400, { form });
	}

	const { imageService, actorService } = event.locals;

	const actor = await actorService.getOrThrow();

	const imagesKeys = Object.keys(imageUpdateFileFields);

	await updateImages({ imagesKeys, imageService, rawData: formData, data: form.data, actor });
}

async function delete_image(event: RequestEvent) {
	const form = await superValidate(event.request, zod(imageDeletionFormSchema));
	if (!form.valid) {
		return fail(400, { form });
	}

	const { imageService } = event.locals;
	await imageService.deleteRecord(form.data.id);
}

export const actions = {
	update_translation: createTranslationUpdater(translationUpdateSchema),
	update_translation_allow_empty: createTranslationUpdater(translationUpdateAllowEmptySchema),
	switch_tag,
	create_tag,
	delete_tag,
	update_slug,
	publish: (event) => edit_article(event, 'publish'),
	hide: (event) => edit_article(event, 'hide'),
	delete: (event) => edit_article(event, 'delete'),
	update_preview,
	create_preview_template,
	update_preview_template,
	delete_preview_template,
	update_image_provider,
	delete_image_provider,
	create_image,
	update_image,
	delete_image
} satisfies Actions;
