<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<sup class="global-text-aesthetic-small-short">
	{@render children()}
</sup>
