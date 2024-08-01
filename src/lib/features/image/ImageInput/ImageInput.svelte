<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import LayerFlashlight from '$lib/design/components/ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import { createMouseWatcher } from '$lib/design/reactivity/mouse-watcher.svelte';

	import ImageProviderWarning from '../ImagesBlock/ImageProviderWarning.svelte';
	import type { ImageSelect } from '../parsers';
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
</script>

<div class="image-input" {...events}>
	<Layers stretch overflow="visible">
		{#if imageProvider.hasValidCredentialsSet}
			<LayerFlashlight {mouse} />
			{#if browser && clientUpload}
				<ImageInputClient {name} {imageId} {processing} />
			{:else}
				<ImageInputServer {name} {imageId} />
			{/if}
		{:else}
			<div class="warning-layer">
				<ImageProviderWarning superValidated={imageProvider.superValidated} />
			</div>
		{/if}
		<div class="global-pointer-events-none dashes"></div>
	</Layers>
</div>

<style>
	.image-input {
		height: var(--size-image-input-height);
		background: var(--color-image-input-bg);
		border-radius: var(--size-image-input-border-radius);
		box-shadow: var(--shadow-image-input);

		/* For Layers */
		--layers-border-radius: var(--size-image-input-border-radius);

		/* For Layer Flashlight */
		--color-layer-flashlight-pointer: var(--color-input-layer-flashlight-hover);
	}

	.dashes {
		border: var(--border-image-input);
		border-radius: var(--size-image-input-border-radius);
	}

	.warning-layer {
		padding: var(--size-image-input-padding);
	}
</style>
