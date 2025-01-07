<script lang="ts">
	import type { Snippet } from 'svelte';

	import Heading from './Heading.svelte';

	type Props = {
		children: Snippet;
	};

	let { children, ...other }: Props = $props();
</script>

<Heading depth={3} {...other}>
	{@render children()}
</Heading>
