<script lang="ts">
	import { ARTISTIC_OVERFLOW, serializePreviewParams, type PreviewDataProp } from '@plavna/common';
	import { ImageCDN, PreviewFoundation, Typography } from '@plavna/design/components';
	import { dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { blur } from 'svelte/transition';
	import Translation from '$lib/i18n/Translation.svelte';

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

	let iframeShown = $state(false);
	let iframeVisible = $state(false);

	let pointer: { x: number; y: number } | null = $state(null);

	let overridenImageTransitionDuration: number | undefined = $state(undefined);

	let iframe: HTMLIFrameElement | null = $state(null);

	function onload() {
		iframeVisible = true;
	}

	function onpointerenter(e: PointerEvent) {
		iframeShown = true;
		sendPointerToIframe({ x: e.offsetX, y: e.offsetY });
	}

	function onpointermove(e: PointerEvent) {
		sendPointerToIframe({ x: e.offsetX, y: e.offsetY });
	}

	function onpointerleave() {
		iframeShown = false;
		iframeVisible = false;
		overridenImageTransitionDuration = 0;
		pointer = null;
	}

	function sendPointerToIframe(pointer: { x: number; y: number } | null) {
		const value = JSON.stringify(pointer);
		iframe?.contentWindow?.postMessage({ key: 'pointer', value }, '*');
	}
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet main()}
		{#if !finalScreenshot}
			<span class="screenshot-not-ready">
				<Typography size="headline-short">
					<Translation key="layout.previews.screenshot_not_ready" />
				</Typography>
			</span>
		{/if}
	{/snippet}
	{#snippet overflowing()}
		<span class="preview" {onpointerenter} {onpointerleave} {onpointermove}>
			{#if finalScreenshot}
				<span class="image-wrapper" class:visible={!iframeVisible}>
					<ImageCDN
						pathAndMeta={finalScreenshot}
						bgInset="{ARTISTIC_OVERFLOW}px"
						zoomOut={false}
						transitionDuration={overridenImageTransitionDuration}
						fitAndCoverParent
					/>
				</span>
			{/if}
			{#if iframeShown && finalUrl}
				<iframe
					out:blur={{ duration: 1000 }}
					bind:this={iframe}
					src={serializePreviewParams(finalUrl, { ...otherData })}
					class="iframe"
					class:visible={iframeVisible}
					style="--inset: {ARTISTIC_OVERFLOW}px"
					title="preview"
					{onload}
				></iframe>
			{/if}
		</span>
	{/snippet}
</PreviewFoundation>

<style>
	.screenshot-not-ready {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--size-2xl);
		text-wrap: balance;
		text-align: center;
		color: var(--color-text-additional);
		background: var(--warm-300-transparent-100);
		pointer-events: none;
	}
	.preview {
		display: block;
		height: 100%;
		pointer-events: all;
		position: relative;
	}

	.iframe,
	.image-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;

		opacity: 0;
		filter: blur(10px);
	}

	.iframe.visible,
	.image-wrapper.visible {
		opacity: 1;
		filter: blur(0px);
	}

	.image-wrapper {
		transition:
			filter 1000ms 0ms,
			opacity 1000ms 500ms;
	}
	.image-wrapper.visible {
		transition:
			filter 1000ms 0ms,
			opacity 1000ms 0ms;
	}

	.iframe {
		border: none;
		transition:
			filter 1000ms 0ms,
			opacity 1000ms 0ms;
	}
	.iframe.visible {
		transition:
			filter 1000ms 0ms,
			opacity 1000ms 0ms;
	}
</style>
