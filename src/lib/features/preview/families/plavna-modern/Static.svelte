<script lang="ts">
	import PreviewFoundation from '$lib/design-system/components/PreviewFoundation.svelte';
	import Typography from '$lib/design-system/components/Typography/Typography.svelte';

	import type { PreviewDataProp } from '../../types';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();
</script>

<PreviewFoundation>
	{#snippet main()}
		<span class="preview">
			<Typography>Modern: {data.title_translation}</Typography>
		</span>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		display: block;
		height: 100%;
		background-color: skyblue;
	}
</style>
