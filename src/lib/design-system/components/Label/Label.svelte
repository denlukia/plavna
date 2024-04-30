<script lang="ts">
	import type { Snippet } from 'svelte';
	import Strong from '$lib/features/markdown/renderers/Strong.svelte';

	import Typography from '../Typography/Typography.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<Typography size="small-short">
	<Strong>
		{@render children()}
	</Strong>
</Typography>
