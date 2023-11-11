<script lang="ts">
	import Image from '$lib/components/Image.svelte';

	import { page } from '$app/stores';
	import { IMG_VALIDATION_CONFIG } from '$lib/isomorphic/constants';
	import { ERRORS } from '$lib/isomorphic/errors';
	import { HSLToString } from '@denlukia/plavna-common/client';

	import type { ClientImageHandler } from '@denlukia/plavna-common/client';
	import type { SupportedLang } from '$lib/isomorphic/languages';
	import type { ImageSelect } from '$lib/server/collections/types';
	import type { ImagekitAuthParams } from 'src/routes/api/imagekit-auth-params/+server';
	import type { ImageUploadReport } from '@denlukia/plavna-common';
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let image: ImageSelect | null = null;
	export let lang: SupportedLang | null = null;

	const dispatch = createEventDispatcher();
	let handler: ClientImageHandler | null = null;
	let processing = false;
	let errors: string | string[] | null = null;

	$: languagedName = lang ? `${name}.${lang}` : name;

	async function onImageChange(e: Event) {
		dispatch('processing-started');
		// 1. Load image uploader module
		const module = await import('@denlukia/plavna-common/client');
		handler = new module.ClientImageHandler();

		// 2. Validate image
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		const { buffer, errors: validationErrors } = await handler.validateFormEntryAndGetBuffer(
			file,
			IMG_VALIDATION_CONFIG
		);
		console.log({ buffer, validationErrors });

		if (validationErrors) {
			errors = validationErrors;
			return;
		}
		if (!buffer) return;

		// Perform 3, 4... only if there's an image to write to
		if (image) {
			// 4. Detect img size, extenstion, maincolor and compose upload path
			const probe = handler.detectImageTypeAndSize(buffer);
			if (!probe) {
				errors = ERRORS.IMAGES.CANT_DETECT_SIZE;
				return;
			}
			const { width, height } = probe;
			const imageEl = handler.convertToImgEl(file);
			const backgroundColor = HSLToString(await handler.extractOptimalColor(imageEl));
			const { folder, fileName, fullPath } = handler.composeFolderAndFilename({
				imageId: image.id,
				lang
			});

			// 5. Check that we have a user and upload image
			const user = $page.data.user;
			if (!user) throw new Error('User is empty');
			const provider = handler.setupProvider(user);
			const source = provider.getProviderType();
			const authParamsResp = await fetch('/api/imagekit-auth-params');
			const authParams: ImagekitAuthParams = await authParamsResp.json();
			await provider.upload({ file, folder, fileName, ...authParams });

			// 6. Report upload result
			const report: ImageUploadReport = {
				image_id: image.id,
				path: fullPath,
				backgroundColor,
				source,
				width,
				height,
				lang
			};
			await fetch('/api/report-img-upload', {
				method: 'POST',
				body: JSON.stringify(report)
			});
		}

		dispatch('processing-finished');
	}
</script>

<div class="image-input">
	{#if image}
		<Image {image} {lang} />
	{/if}
	{lang || ''}
	<input
		disabled={processing}
		type="file"
		maxlength="1"
		accept={IMG_VALIDATION_CONFIG.formats.join(',')}
		name={languagedName}
		on:change={onImageChange}
	/>
	{#if processing}
		Processing...
	{/if}
</div>

<style>
	.image-input {
		background: lightpink;
	}
</style>
