<script lang="ts">
	import { Renderer } from 'marked';
	import type { Snippet } from 'svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<Typography>
	{@render children()}
</Typography>
