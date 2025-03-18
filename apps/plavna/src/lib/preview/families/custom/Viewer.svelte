<script lang="ts">
	import { ARTISTIC_OVERFLOW, serializePreviewParams, type PreviewDataProp } from '@plavna/common';
	import { Image, PreviewFoundation } from '@plavna/design/components';
	import { dev } from '$app/environment';
	import { env } from '$env/dynamic/public';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let { viewing_in_article, screenshot, screenshot_in_article, url } = $derived(data);
	let { width, height, ...otherData } = $derived(data);

	let finalUrl = $derived(
		dev ? url?.replace(env.PUBLIC_REPLACE_PREVIEW_URL_IN, env.PUBLIC_REPLACE_PREVIEW_URL_OUT) : url
	);

	let finalScreenshot = $derived(viewing_in_article ? screenshot_in_article : screenshot);

	let imageVisible = $state(true);
	let iframeShown = $state(false);
	let iframeVisible = $state(false);

	let pointer: { x: number; y: number } | null = $state(null);

	let overridenImageTransitionDuration: number | undefined = $state(undefined);

	let iframe: HTMLIFrameElement | null = $state(null);

	function onload() {
		iframeVisible = true;
		imageVisible = false;
	}

	function onpointerenter(e: PointerEvent) {
		iframeShown = true;
		pointer = { x: e.offsetX, y: e.offsetY };
	}

	function onpointerleave() {
		iframeShown = false;
		iframeVisible = false;
		overridenImageTransitionDuration = 0;
		imageVisible = true;
		pointer = null;
	}

	function onpointermove(e: PointerEvent) {
		pointer = { x: e.offsetX, y: e.offsetY };
	}
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet overflowing()}
		<span class="preview" {onpointerenter} {onpointerleave} {onpointermove}>
			{#if iframeShown && finalUrl}
				<iframe
					src={serializePreviewParams(finalUrl, { ...otherData, pointer: pointer })}
					class="iframe"
					class:visible={iframeVisible}
					style="--inset: {ARTISTIC_OVERFLOW}px"
					title="preview"
					{onload}
				></iframe>
			{/if}

			{#if finalScreenshot}
				<div class="image-wrapper" class:visible={imageVisible}>
					<Image
						pathAndMeta={finalScreenshot}
						bgInset="{ARTISTIC_OVERFLOW}px"
						zoomOut={false}
						transitionDuration={overridenImageTransitionDuration}
					/>
				</div>
			{/if}
		</span>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		display: block;
		height: 100%;
		pointer-events: all;
	}

	.iframe,
	.image-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.image-wrapper {
		visibility: hidden;
	}

	.image-wrapper.visible {
		visibility: visible;
	}

	.iframe {
		border: none;
		visibility: hidden;
	}
	.iframe.visible {
		visibility: visible;
	}
</style>
