<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import LayerFlashlight from '$lib/design/components/ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import Image from '$lib/design/components/Image/Image.svelte';
	import { createMouseWatcher } from '$lib/design/reactivity/mouse-watcher.svelte';

	import ImageProviderWarning from '../ImagesBlock/ImageProviderWarning.svelte';
	import type { ImageSelect } from '../parsers';
	import { prepareImage } from '../utils';
	import ImageInputClient from './ImageInputClient.svelte';
	import ImageInputServer from './ImageInputServer.svelte';

	type Props = {
		name: string;
		imageId?: ImageSelect['id'] | null;
		processing?: boolean;
		clientUpload?: boolean;
	};

	let { name, imageId, processing = $bindable(false), clientUpload = false }: Props = $props();

	let { mouse, ...events } = createMouseWatcher();

	let imageProvider = $page.data.imageProvider;
	let preparedImage = $derived(
		typeof imageId === 'number'
			? prepareImage(imageId, $page.data.user, $page.data.images, $page.data.recordsTranslations)
			: null
	);
</script>

<div class="image-input" {...events}>
	<Layers stretch overflow="visible">
		{#if imageProvider.hasValidCredentialsSet}
			{#if imageId && preparedImage}
				<div class="image">
					<Image {preparedImage} />
				</div>
			{:else}
				<LayerFlashlight {mouse} />
			{/if}
			{#if browser && clientUpload}
				<ImageInputClient {name} {preparedImage} {processing} />
			{:else}
				<ImageInputServer {name} {preparedImage} />
			{/if}
		{:else}
			<div class="warning-layer">
				<ImageProviderWarning superValidated={imageProvider.superValidated} />
			</div>
		{/if}
		<div class="global-pointer-events-none dashes"></div>
		<div class="global-pointer-events-none shadow"></div>
	</Layers>
</div>

<style>
	.image-input {
		height: var(--size-image-input-height);
		background: var(--color-image-input-bg);
		border-radius: var(--size-image-input-border-radius);
		overflow: hidden;

		/* For Layers */
		--layers-border-radius: var(--size-image-input-border-radius);

		/* For Layer Flashlight */
		--color-layer-flashlight-pointer: var(--color-input-layer-flashlight-hover);
	}

	.dashes {
		border: var(--border-image-input);
		border-radius: var(--size-image-input-border-radius);
	}

	.shadow {
		box-shadow: var(--shadow-image-input);
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
