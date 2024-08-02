<script lang="ts">
	import type { ClientImageHandler as ClientImageHandlerType } from '@denlukia/plavna-common/client';
	import { page } from '$app/stores';
	import { IMG_VALIDATION_CONFIG } from '$lib/collections/constants';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import type { PreparedImage } from '$lib/design/types';

	import Translation from '../../i18n/Translation.svelte';
	import type { ImageDeletionRequest } from '../types';
	import { getLangFromLanguagedName } from '../utils';
	import DropZone from './DropZone.svelte';

	type Props = {
		name: string;
		preparedImage: PreparedImage | null;
		processing: boolean;
	};

	let { name, preparedImage, processing = $bindable() }: Props = $props();

	let value: File | null = $state(null);
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
		if (!actor) throw Error('User not found');
		if (!preparedImage) throw Error('Image not found');
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

		// 3. Process and upload image
		const report = await imageHandler.upload({
			imageId: preparedImage.id,
			lang: getLangFromLanguagedName(name)
		});

		// 4. Report image upload
		await fetch('/api/images/report-upload', {
			method: 'POST',
			body: JSON.stringify(report)
		});

		processing = false;
	}

	async function onDelete() {
		// 1. Perform basic checks, and initialize image uploader (if needed)
		const actor = $page.data.actor;
		if (!actor) throw Error('User not found');
		if (!preparedImage) throw Error('Image not found');
		if (!imageHandler) imageHandler = await getImageHandler();
		if (!imageHandler.provider)
			await imageHandler.setProviderAndUploader(actor, '/api/images/credentials');

		// 2. Delete image from provider TODO

		const deletionRequest: ImageDeletionRequest = {
			id: preparedImage.id,
			lang: getLangFromLanguagedName(name)
		};

		// 3. Delete image path in DB
		await fetch('/api/images/delete-path', {
			method: 'POST',
			body: JSON.stringify(deletionRequest)
		});
	}
</script>

{#if preparedImage}
	<div class="image-actions">
		<Button type="button" onclick={onDelete} size="small" kind="translucent">Delete</Button>
	</div>
{:else}
	<DropZone {name} {onImageChange} bind:value />
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
