<script lang="ts">
	import Image from '$lib/design/components/Image.svelte';
	import PreviewFoundation from '$lib/design/components/PreviewFoundation.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import { prepareImage } from '$lib/features/image/utils';

	import type { PreviewDataProp } from '../../types';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let { screenshot } = $derived(data);
</script>

<PreviewFoundation>
	{#snippet main()}
		<span class="preview">
			<!-- <Typography size="small-short">Custom: {JSON.stringify(data, null, 2)}</Typography> -->
			{#if screenshot}
				<Image preparedImage={screenshot} />
			{/if}
		</span>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		display: block;
		height: 100%;
		background-color: lightsalmon;
	}
</style>
