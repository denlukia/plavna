<script lang="ts">
	import type { Snippet } from 'svelte';

	import Typography from '../Typography/Typography.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<Typography size="small-short">
	{@render children()}
</Typography>
