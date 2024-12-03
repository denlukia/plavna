<script lang="ts">
	import type { Snippet } from 'svelte';

	import Heading from './Heading.svelte';

	type Props = {
		children: Snippet;
	};

	let { children, ...other }: Props = $props();
</script>

<Heading depth={1} {...other}>
	{@render children()}
</Heading>
