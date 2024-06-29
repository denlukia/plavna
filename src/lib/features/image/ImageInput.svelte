<script lang="ts">
	import type { ClientImageHandler as ClientImageHandlerType } from '@denlukia/plavna-common/client';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
	import ImageById from '$lib/features/image/ImageById.svelte';

	import type { ImageSelect } from './parsers';

	export let name: string;
	export let image: ImageSelect | null = null;
	export let lang: SupportedLang | null = null;
	export let clientUpload: boolean = false;

	const dispatch = createEventDispatcher();
	let processing = false;
	let clientUploadErrors: string | string[] | null = null;
	let ClientImageHandler: typeof ClientImageHandlerType | null = null;

	$: languagedName = lang ? `${name}.${lang}` : name;

	async function onImageChange(e: Event) {
		if (!clientUpload) return;
		// 1. Load image uploader module and prepare info
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		dispatch('processing-started');
		if (!ClientImageHandler) {
			({ ClientImageHandler } = await import('@denlukia/plavna-common/client'));
		}
		const user = $page.data.user;
		if (!user) throw Error('User not found');
		const imageId = image?.id;
		if (!imageId) throw Error('Image not found');

		// 2. Validate image
		let imageHandler: ClientImageHandlerType;
		try {
			imageHandler = await new ClientImageHandler().setImageFromEntry(file, IMG_VALIDATION_CONFIG);
		} catch (err: any) {
			clientUploadErrors = err;
			dispatch('processing-finished');
			return;
		}

		// 3. Process and upload image
		await imageHandler.setProviderAndUploader(user, '/api/imagekit-auth-params');
		const report = await imageHandler.upload({ imageId, lang });

		// 4. Report image upload
		await fetch('/api/report-img-upload', {
			method: 'POST',
			body: JSON.stringify(report)
		});

		dispatch('processing-finished');
	}
</script>

<div class="image-input">
	{#if image}
		<ImageById id={image.id} />
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
	<label>
		Delete {languagedName}
		<input type="checkbox" name="delete_{languagedName}" />
	</label>

	{#if processing}
		Processing...
	{/if}
	{#if clientUploadErrors}
		{clientUploadErrors}
	{/if}
</div>

<style>
	.image-input {
		background: lightpink;
	}
</style>
