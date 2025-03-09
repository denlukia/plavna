<script lang="ts">
	import { ARTISTIC_OVERFLOW, serializePreviewParams, type PreviewDataProp } from '@plavna/common';
	import { Image, PreviewFoundation } from '@plavna/design/components';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let { viewing_in_article, screenshot, screenshot_in_article, url } = $derived(data);

	let finalScreenshot = $derived(viewing_in_article ? screenshot_in_article : screenshot);

	let hovered = $state(false);
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet overflowing()}
		<span
			class="preview"
			onpointerenter={() => (hovered = true)}
			onpointerleave={() => (hovered = false)}
		>
			{#if finalScreenshot && !hovered}
				<Image pathAndMeta={finalScreenshot} bgInset="{ARTISTIC_OVERFLOW}px" zoomOut={false} />
			{/if}

			{#if hovered && url}
				<iframe
					class="iframe"
					style="inset: {ARTISTIC_OVERFLOW}px"
					title="preview"
					src={serializePreviewParams(url, data)}
				></iframe>
			{/if}
		</span>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		display: block;
		height: 100%;
	}

	.iframe {
		position: absolute;
		inset: var(--inset);
	}
</style>
