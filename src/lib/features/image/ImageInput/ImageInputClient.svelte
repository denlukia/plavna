<script lang="ts">
	import type { ClientImageHandler as ClientImageHandlerType } from '@denlukia/plavna-common/images';
	import type { ImagePathUpdateOrDeletion } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { IMAGE_CREDENTIALS_PATH, IMG_VALIDATION_CONFIG } from '$lib/collections/config';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Spinner from '$lib/design/components/Loaders/Spinner.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import type { ImageInputsTranslationsDictValue } from '$lib/features/i18n/types';

	import type { ImageService } from '../service';
	import { getLangFromLanguagedName } from '../utils';
	import type { ImageSelect } from '../validators';
	import DropZone from './DropZone.svelte';

	type Props = {
		name: string;
		image: ImageSelect;
		translation: ImageInputsTranslationsDictValue | null;
		isPathPresent: boolean;
		processing: boolean;
	};

	let {
		name,
		isPathPresent,
		image = $bindable(),
		translation = $bindable(),
		processing = $bindable()
	}: Props = $props();

	let errors: string | string[] | null = $state(null);
	let imageHandler: ClientImageHandlerType | null = null;

	async function getImageHandler() {
		let { ClientImageHandler } = await import('@denlukia/plavna-common/images');
		return new ClientImageHandler();
	}

	// TODO Dry this up

	async function onImageChange(e: Event) {
		// 0. Check file presence
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		processing = true;

		// 1. Perform basic checks, and initialize image uploader (if needed)
		const actor = $page.data.actor;
		if (!actor) throw Error('Actor not found');

		if (!imageHandler) imageHandler = await getImageHandler();
		await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);

		// 2. Validate image
		try {
			await imageHandler.setImageFromEntry(file, IMG_VALIDATION_CONFIG);
		} catch (err: any) {
			errors = err;
			processing = false;
			return;
		}

		const lang = getLangFromLanguagedName(name);

		// 3. Process and upload image
		const pathUpdate = await imageHandler.upload({ imageId: image.id, lang });

		// 4. Report image upload
		const response = await fetch('/api/images/update-path', {
			method: 'POST',
			body: JSON.stringify(pathUpdate)
		});
		if (!response.ok) {
			errors = await response.text();
		}

		// 5. Update translation and path locally
		const update: Awaited<ReturnType<ImageService['updatePath']>> = await response.json();
		updateLocalsFromResponse(update);

		processing = false;
	}

	async function onDelete() {
		processing = true;

		// 1. Perform basic checks, and initialize image uploader (if needed)
		const actor = $page.data.actor;
		if (!actor) throw Error('User not found');

		// 2. Delete image from provider TODO
		// if (!imageHandler) imageHandler = await getImageHandler();
		// if (!imageHandler.provider)
		// 	await imageHandler.setProviderAndUploader(actor, IMAGE_CREDENTIALS_PATH);

		const lang = getLangFromLanguagedName(name);

		const pathUpdate: ImagePathUpdateOrDeletion = { record: { id: image.id }, lang };

		// 3. Delete image path in DB
		const response = await fetch('/api/images/update-path', {
			method: 'POST',
			body: JSON.stringify(pathUpdate)
		});
		if (!response.ok) {
			errors = await response.text();
		}

		// 4. Update translation and path locally
		const update: Awaited<ReturnType<ImageService['updatePath']>> = await response.json();
		updateLocalsFromResponse(update);

		// TODO: If someone throws above – we don't get to set this to false
		processing = false;
	}

	function updateLocalsFromResponse(update: Awaited<ReturnType<ImageService['updatePath']>>) {
		const { image: newImage, translation: newTranslation } = update;

		image = newImage;

		if (newTranslation) {
			const { key: translationKey, ...translationOther } = newTranslation;
			translation = translationOther;
		}
	}
</script>

{#if isPathPresent}
	<div class="image-actions">
		<Button type="button" onclick={onDelete} size="small" kind="translucent">
			<Translation key="article_editor.images.clear_translation" />
		</Button>
	</div>
{:else}
	<DropZone {name} {onImageChange} />
{/if}
{#if processing}
	<div class="spinner-wrapper" transition:fade={{ duration: 250 }}>
		<Spinner />
	</div>
{/if}
{#if errors}
	<div class="errors">{errors}</div>
{/if}

<style>
	.image-actions {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding: var(--size-image-input-padding);

		animation: fade-in 500ms backwards;
	}
	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
