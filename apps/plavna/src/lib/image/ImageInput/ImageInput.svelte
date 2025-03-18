<script lang="ts">
	import { Image, LayerFlashlight, Layers } from '@plavna/design/components';
	import type { ImagePathAndMeta } from '@plavna/design/components';
	import { createMouseWatcher } from '@plavna/design/reactivity';
	import type { SupportedLang } from '@plavna/image-uploader/types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import type { ImageInputsTranslationsDictValue } from '$lib/i18n/types';

	import ImageProviderWarning from '../ImagesBlock/ImageProviderWarning.svelte';
	import { computeSrc } from '../utils';
	import type { ImageSelect } from '../validators';
	import ImageInputClient from './ImageInputClient.svelte';
	import ImageInputServer from './ImageInputServer.svelte';

	type Props = {
		name: string;
		image: ImageSelect | null;
		translation: ImageInputsTranslationsDictValue | null;
		lang: SupportedLang | null;
		processing?: boolean;
		clientUpload?: boolean;
	};

	let {
		name,
		lang,
		image = $bindable(),
		translation = $bindable(),
		processing = $bindable(false),
		clientUpload = false
	}: Props = $props();

	let { mouse, ...events } = createMouseWatcher();

	let imageProvider = $derived($page.data.imageProvider);

	let pathAndMeta = $derived.by(getPathAndMeta);
	let isPathPresent = $derived(Boolean(pathAndMeta));

	function getPathAndMeta(): ImagePathAndMeta | null {
		if (!image) {
			return null;
		}

		const { width, height, background } = image;
		let { path } = image;

		if (lang) {
			path = translation?.[lang] || null;
		}

		const src = computeSrc(image.source, $page.data.user, path);
		if (!src) return null;

		return {
			id: image.id,
			alt: null,
			src,
			width,
			height,
			background
		};
	}
</script>

<div class="image-input" {...events}>
	<Layers stretch overflow="visible">
		{#if imageProvider.hasValidCredentialsSet}
			{#if image && image.id && pathAndMeta}
				<div class="image" transition:fade={{ duration: 250 }}>
					<Image {pathAndMeta} />
				</div>
			{:else}
				<LayerFlashlight {mouse} />
			{/if}
			{#if browser && clientUpload && image}
				<ImageInputClient {name} {isPathPresent} {processing} bind:image bind:translation />
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
		width: 100%;
		height: var(--size-image-input-height);
		background: var(--color-image-input-bg);
		border-radius: var(--size-image-input-border-radius);
		box-shadow: var(--shadow-input);
		/* overflow: hidden; */

		/* For Layers */
		--layers-border-radius: var(--size-image-input-border-radius);

		/* For Layer Flashlight */
		--color-layer-flashlight-pointer: var(--color-input-layer-flashlight-hover);
	}

	.image {
		overflow: hidden;
		border-radius: var(--size-image-input-border-radius);
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
