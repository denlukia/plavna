<script lang="ts">
	import { Image, PreviewFoundation } from '@plavna/design/components';
	import { ARTISTIC_OVERFLOW_PADDING } from '$lib/common/config';

	import type { PreviewDataProp } from '../../types';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let { viewing_in_article, screenshot, screenshot_in_article } = $derived(data);
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW_PADDING}>
	{#snippet overflowing()}
		<span class="preview">
			<!-- <Typography size="small-short">Custom: {JSON.stringify(data, null, 2)}</Typography> -->
			{#if viewing_in_article && screenshot_in_article}
				<Image pathAndMeta={screenshot_in_article} />
			{:else if !viewing_in_article && screenshot}
				<Image pathAndMeta={screenshot} />
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
