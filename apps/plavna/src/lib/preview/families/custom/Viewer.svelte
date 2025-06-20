<script lang="ts">
	import { ARTISTIC_OVERFLOW, serializePreviewParams, type PreviewDataProp } from '@plavna/common';
	import { ImageCDN, PreviewFoundation, Typography } from '@plavna/design/components';
	import { dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import Translation from '$lib/i18n/Translation.svelte';

	import Iframe from './Iframe.svelte';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let { viewing_in_article, screenshot, screenshot_in_article, url, width, height, ...otherData } =
		$derived(data);

	let finalUrl = $derived(
		dev ? url?.replace(env.PUBLIC_REPLACE_PREVIEW_URL_IN, env.PUBLIC_REPLACE_PREVIEW_URL_OUT) : url
	);
	let finalScreenshot = $derived(viewing_in_article ? screenshot_in_article : screenshot);
	let overridenImageTransitionDuration: number | undefined = $state(undefined);

	let iframe: HTMLIFrameElement | null = $state(null);
	let iframeShown = $state(false);
	let iframeReady = $state(false);
	let pointer: { x: number; y: number } | null = $state(null);

	function onpointerenter(e: PointerEvent) {
		iframeShown = true;
		sendPointerToIframe({ x: e.offsetX, y: e.offsetY });
	}

	function onpointermove(e: PointerEvent) {
		iframeShown = true;
		sendPointerToIframe({ x: e.offsetX, y: e.offsetY });
	}

	function onpointerleave() {
		iframeShown = false;
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
				<span class="image-wrapper" class:visible={!iframeReady}>
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
				<Iframe
					url={finalUrl}
					data={{ ...otherData, viewing_in_article, url }}
					bind:ready={iframeReady}
					bind:iframe
				/>
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

	.image-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;

		opacity: 0;
		filter: blur(10px);

		transition:
			filter 750ms 0ms,
			opacity 750ms 375ms;
	}

	.image-wrapper.visible {
		opacity: 1;
		filter: blur(0px);
		transition:
			filter 750ms 0ms,
			opacity 750ms 0ms;
	}
</style>
