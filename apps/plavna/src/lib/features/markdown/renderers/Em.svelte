<script lang="ts">
	import type { Snippet } from 'svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<em class="global-text-em">
	{@render children()}
</em>
