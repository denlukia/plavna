<script lang="ts">
	import { ARTISTIC_OVERFLOW, serializePreviewParams, type PreviewDataProp } from '@plavna/common';
	import { ImageCDN, PreviewFoundation, Typography } from '@plavna/design/components';
	import { dev } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { onDestroy } from 'svelte';
	import Translation from '$lib/i18n/Translation.svelte';
	import ImageWrapper from '$lib/preview/ImageWrapper.svelte';
	import { RIPPLE_DURATION_MS } from '$lib/preview/RippleMask.svelte';

	import Iframe from './Iframe.svelte';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let { viewing_in_article, screenshot, screenshot_in_article, url, width, height, ...otherData } =
		$derived(data);

	let finalUrl = $derived(
		dev && env.PUBLIC_REPLACE_PREVIEW_URL_IN && env.PUBLIC_REPLACE_PREVIEW_URL_OUT
			? url?.replace(env.PUBLIC_REPLACE_PREVIEW_URL_IN, env.PUBLIC_REPLACE_PREVIEW_URL_OUT)
			: url
	);
	let finalScreenshot = $derived(viewing_in_article ? screenshot_in_article : screenshot);
	let overridenImageTransitionDuration: number | undefined = $state(undefined);

	let iframe: HTMLIFrameElement | null = $state(null);
	let iframeShown = $state(false);
	let iframeReady = $state(false);
	let pointer: { x: number; y: number } | null = $state(null);
	// True from pointer-leave until the screenshot ripple has closed back
	// over the still-opaque iframe; only then is the iframe torn down
	// (its outro fade then plays invisibly behind the re-shown screenshot,
	// instead of showing white through the closing hole).
	let covering = $state(false);
	let coverTimer: ReturnType<typeof setTimeout> | null = null;

	function onpointerenter(e: PointerEvent) {
		if (coverTimer) {
			clearTimeout(coverTimer);
			coverTimer = null;
		}
		covering = false;
		iframeShown = true;
		sendPointerToIframe({ x: e.offsetX, y: e.offsetY });
	}

	function onpointermove(e: PointerEvent) {
		iframeShown = true;
		sendPointerToIframe({ x: e.offsetX, y: e.offsetY });
	}

	function onpointerleave() {
		overridenImageTransitionDuration = 0;
		pointer = null;
		covering = true;
		if (coverTimer) clearTimeout(coverTimer);
		coverTimer = setTimeout(() => {
			coverTimer = null;
			iframeShown = false;
			covering = false;
		}, RIPPLE_DURATION_MS + 100);
	}

	onDestroy(() => {
		if (coverTimer) clearTimeout(coverTimer);
	});

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
				<ImageWrapper visible={!iframeReady || covering}>
					<ImageCDN
						pathAndMeta={finalScreenshot}
						bgInset="{ARTISTIC_OVERFLOW}px"
						zoomOut={false}
						transitionDuration={overridenImageTransitionDuration}
						fitAndCoverParent
						objectFit="stretch"
					/>
				</ImageWrapper>
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
</style>
