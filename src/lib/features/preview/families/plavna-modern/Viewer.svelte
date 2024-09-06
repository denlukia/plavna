<script lang="ts">
	import ContinuousCorners from '$lib/design/components/ContinuousCorners/ContinuousCorners.svelte';
	import PreviewFoundation from '$lib/design/components/PreviewFoundation/PreviewFoundation.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import type { PreviewDataProp } from '../../types';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();
</script>

<PreviewFoundation>
	{#snippet main()}
		<ContinuousCorners radius={55} style="height: 100%;">
			<span class="preview">
				<Typography size="small-short">Modern: {JSON.stringify(data, null, 2)}</Typography>
			</span>
		</ContinuousCorners>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		display: block;
		height: 100%;
		background-color: skyblue;
	}
</style>
