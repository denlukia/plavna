<script lang="ts">
	import Image from '$lib/components/Image.svelte';

	import { page } from '$app/stores';
	import { IMG_VALIDATION_CONFIG } from '$lib/isomorphic/constants';

	import type { ClientImageHandler as ClientImageHandlerType } from '@denlukia/plavna-common/client';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import type { ImageSelect } from '$lib/server/collections/types';
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let image: ImageSelect | null = null;
	export let lang: SupportedLang | null = null;
	export let clientUpload: boolean = false;
	export let errors: string | string[] | undefined | null = null;

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
		const imageHandler = new ClientImageHandler(file);
		if (imageHandler.checkPresence()) {
			try {
				await imageHandler.validate(IMG_VALIDATION_CONFIG);
			} catch (err: any) {
				errors = err;
				dispatch('processing-finished');
				return;
			}

			// 3. Process and upload image
			await imageHandler.setUploaderFromUser(user, '/api/imagekit-auth-params');
			const report = await imageHandler.processAndUpload({ imageId, lang });

			// 4. Report image upload
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
	<label>
		Delete {languagedName}
		<input type="checkbox" name={`delete_${languagedName}`} />
	</label>

	{#if processing}
		Processing...
	{/if}
	{#if errors}
		Errors: {errors}
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
