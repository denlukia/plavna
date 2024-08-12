<script lang="ts">
	import path from 'path';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import LayerFlashlight from '$lib/design/components/ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import Image from '$lib/design/components/Image/Image.svelte';
	import { createMouseWatcher } from '$lib/design/reactivity/mouse-watcher.svelte';
	import type { ImagePathAndMeta } from '$lib/design/types';

	import ImageProviderWarning from '../ImagesBlock/ImageProviderWarning.svelte';
	import type { ImageSelect } from '../parsers';
	import { computeSrc } from '../utils';
	import ImageInputClient from './ImageInputClient.svelte';
	import ImageInputServer from './ImageInputServer.svelte';

	type Props = {
		name: string;
		imageId: ImageSelect['id'];
		lang: SupportedLang | null;
		processing?: boolean;
		clientUpload?: boolean;
	};

	let {
		name,
		imageId,
		lang,
		processing = $bindable(false),
		clientUpload = false
	}: Props = $props();

	let { mouse, ...events } = createMouseWatcher();

	let imageProvider = $page.data.imageProvider;
	let image = $state($page.data.images?.[imageId]);
	let translation = $state($page.data.imageInputsTranslations?.[imageId] || null);
	let pathAndMeta = $derived.by(getPathAndMeta);
	let isPathPresent = $derived(Boolean(pathAndMeta));

	function getPathAndMeta(): ImagePathAndMeta | null {
		if (!image) {
			return null;
		}

		const { alt, width, height, background } = image;
		let { path } = image;

		const translationKey = image.path_translation_key;
		if (lang && translationKey) {
			path = translation?.[lang] || null;
		}

		const src = computeSrc(image.source, $page.data.user, path);
		if (!src) return null;

		return {
			id: imageId,
			src,
			alt,
			width,
			height,
			background
		};
	}
</script>

<div class="image-input" {...events}>
	<Layers stretch overflow="visible">
		{#if imageProvider.hasValidCredentialsSet}
			{#if imageId && pathAndMeta}
				<div class="image">
					<Image {pathAndMeta} />
				</div>
			{:else}
				<LayerFlashlight {mouse} />
			{/if}
			{#if browser && clientUpload && image}
				<ImageInputClient
					{imageId}
					{name}
					{isPathPresent}
					{processing}
					bind:image
					bind:translation
				/>
			{:else}
				<ImageInputServer {name} {isPathPresent} />
			{/if}
		{:else}
			<div class="warning-layer">
				<ImageProviderWarning superValidated={imageProvider.superValidated} />
			</div>
		{/if}
	</Layers>
</div>

<style>
	.image-input {
		height: var(--size-image-input-height);
		background: var(--color-image-input-bg);
		border-radius: var(--size-image-input-border-radius);
		box-shadow: var(--shadow-input);
		overflow: hidden;

		/* For Layers */
		--layers-border-radius: var(--size-image-input-border-radius);

		/* For Layer Flashlight */
		--color-layer-flashlight-pointer: var(--color-input-layer-flashlight-hover);
	}

	.image {
		overflow: hidden;
	}

	.image > :global(*) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.warning-layer {
		padding: var(--size-image-input-padding);
	}
</style>
