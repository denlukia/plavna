<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Spinner from '$lib/design/components/Loaders/Spinner.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import type { ImageInputsTranslationsDictValue } from '$lib/features/i18n/types';

	import { deleteImage, uploadImage, type ImageWorkConfig } from '../client-uploader';
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

	const imageWorkConfig: ImageWorkConfig = {
		actor: $page.data.actor,
		imageId: image.id,
		lang: getLangFromLanguagedName($page.data.lang),
		setProcessing: (v) => (processing = v),
		setErrors: (v) => (errors = v),
		updateLocalsFromResponse: (update) => {
			const { image: newImage, translation: newTranslation } = update;

			image = newImage;

			if (newTranslation) {
				const { key: translationKey, ...translationOther } = newTranslation;
				translation = translationOther;
			}
		}
	};

	async function onImageChange(e: Event) {
		// 0. Check file presence
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		await uploadImage(file, imageWorkConfig);
	}

	async function onDrop(file: File) {
		await uploadImage(file, imageWorkConfig);
	}

	function onDelete() {
		deleteImage(imageWorkConfig);
	}
</script>

{#if isPathPresent}
	<div class="image-actions">
		<Button type="button" onclick={onDelete} size="small" kind="translucent">
			<Translation key="article_editor.images.clear_translation" />
		</Button>
	</div>
{:else}
	<DropZone {name} {onImageChange} {onDrop} {errors} />
{/if}
{#if processing}
	<div class="spinner-wrapper" transition:fade={{ duration: 250 }}>
		<Spinner />
	</div>
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
