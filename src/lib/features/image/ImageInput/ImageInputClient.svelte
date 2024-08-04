<script lang="ts">
	import type { ClientImageHandler as ClientImageHandlerType } from '@denlukia/plavna-common/client';
	import type { ImagePathUpdateOrDeletion } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
	import Button from '$lib/design/components/Button/Button.svelte';
	import type { ImageInputsTranslationsDictValue } from '$lib/features/i18n/types';

	import type { ImageSelect } from '../parsers';
	import type { ImageService } from '../service';
	import type { ImagesDictValue } from '../types';
	import { getLangFromLanguagedName } from '../utils';
	import DropZone from './DropZone.svelte';

	type Props = {
		name: string;
		imageId: ImageSelect['id'];
		image: ImagesDictValue;
		translation: ImageInputsTranslationsDictValue | null;
		isPathPresent: boolean;
		processing: boolean;
	};

	let {
		name,
		isPathPresent,
		imageId,
		image = $bindable(),
		translation = $bindable(),
		processing = $bindable()
	}: Props = $props();

	let errors: string | string[] | null = $state(null);
	let imageHandler: ClientImageHandlerType | null = null;

	async function getImageHandler() {
		let { ClientImageHandler } = await import('@denlukia/plavna-common/client');
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
		if (!imageHandler.provider)
			await imageHandler.setProviderAndUploader(actor, '/api/images/credentials');

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
		const pathUpdate = await imageHandler.upload({ imageId, lang });

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
		// 	await imageHandler.setProviderAndUploader(actor, '/api/images/credentials');

		const lang = getLangFromLanguagedName(name);

		const pathUpdate: ImagePathUpdateOrDeletion = { record: { id: imageId }, lang };

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

		const { id: imageId, ...imageOther } = newImage;
		image = imageOther;

		if (newTranslation) {
			const { key: translationKey, ...translationOther } = newTranslation;
			translation = translationOther;
		}
	}
</script>

{#if isPathPresent}
	<div class="image-actions">
		<Button type="button" onclick={onDelete} size="small" kind="translucent">Delete</Button>
	</div>
{:else}
	<DropZone {name} {onImageChange} />
{/if}
{#if processing}
	<div class="processing">Processing...</div>
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
	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
