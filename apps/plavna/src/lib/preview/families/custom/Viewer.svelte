<script lang="ts">
	import { Image, PreviewFoundation } from '@plavna/design/components';
	import { ARTISTIC_OVERFLOW } from '$lib/styles/grid';

	import type { PreviewDataProp } from '../../types';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let { viewing_in_article, screenshot, screenshot_in_article } = $derived(data);

	let finalScreenshot = $derived(viewing_in_article ? screenshot_in_article : screenshot);
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet overflowing()}
		<span class="preview">
			<!-- <Typography size="small-short">Custom: {JSON.stringify(data, null, 2)}</Typography> -->
			{#if finalScreenshot}
				<Image pathAndMeta={finalScreenshot} bgInset="{ARTISTIC_OVERFLOW}px" zoomOut={false} />
			{/if}
		</span>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		display: block;
		height: 100%;
	}
</style>
