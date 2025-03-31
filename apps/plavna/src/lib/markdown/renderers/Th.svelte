<script lang="ts">
	import { Typography } from '@plavna/design/components';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<th>
	<Typography purpose="markdown">
		{@render children()}
	</Typography>
</th>

<style>
</style>
