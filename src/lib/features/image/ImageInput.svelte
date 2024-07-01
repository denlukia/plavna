<script lang="ts">
	import type { ClientImageHandler as ClientImageHandlerType } from '@denlukia/plavna-common/client';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
	import LayerFlashlight from '$lib/design/components/ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import { createMouseWatcher } from '$lib/design/reactivity/mouse-watcher.svelte';
	import ImageById from '$lib/features/image/ImageById.svelte';

	import Translation from '../i18n/Translation.svelte';
	import type { ImageSelect } from './parsers';

	export let name: string;
	export let image: ImageSelect | null = null;
	export let inputValue: File | null = null;
	export let lang: SupportedLang | null = null;
	export let clientUpload: boolean = false;

	const dispatch = createEventDispatcher();
	let processing = false;
	let clientUploadErrors: string | string[] | null = null;
	let ClientImageHandler: typeof ClientImageHandlerType | null = null;

	$: languagedName = lang ? `${name}.${lang}` : name;

	let { mouse, ...events } = createMouseWatcher();

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
		const actor = $page.data.actor;
		if (!actor) throw Error('User not found');
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
		await imageHandler.setProviderAndUploader(actor, '/api/imagekit-auth-params');
		const report = await imageHandler.upload({ imageId, lang });

		// 4. Report image upload
		await fetch('/api/report-img-upload', {
			method: 'POST',
			body: JSON.stringify(report)
		});

		dispatch('processing-finished');
	}

	function onDelete() {
		// TODO
	}
</script>

<div class="image-input" {...events}>
	<Layers stretch>
		<LayerFlashlight {mouse} />
		<div class="layer-server-uploader">
			<label class="drop-zone">
				<Typography size="body-short">
					<Translation key="article_editor.previews.image_dropzone" />
				</Typography>
				<br />
				<Typography size="body-short">
					<input
						class="file-input"
						disabled={processing}
						type="file"
						maxlength="1"
						accept={IMG_VALIDATION_CONFIG.formats.join(',')}
						name={languagedName}
						bind:value={inputValue}
						on:change={onImageChange}
					/>
				</Typography>
			</label>
			<!-- {#if image}
					<label>
						Mark for deletion
						<input type="checkbox" name="delete_{languagedName}" />
					</label>
				{/if} -->
		</div>
		<!-- <div class="layer-client-uploader">
			{#if image}
				<ImageById id={image.id} />
			{/if}
			{#if processing}
				Processing...
			{/if}
			{#if clientUploadErrors}
				{clientUploadErrors}
			{/if}
		</div> -->
	</Layers>
</div>

<style>
	.image-input {
		height: var(--size-image-input-height);
		background: var(--color-image-input-bg);
		border: var(--border-image-input);
		border-radius: var(--size-image-input-border-radius);
	}
	.drop-zone {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		line-height: normal;
		padding-inline: var(--size-image-input-padding-inline);
		color: var(--color-imga-input);
	}
	.file-input {
		width: 100%;
		margin-inline-start: -7px;
	}
	.file-input::file-selector-button {
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		opacity: 0;
	}
</style>
