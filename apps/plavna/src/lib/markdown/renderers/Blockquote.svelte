<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<blockquote class="blockquote">
	{@render children()}
</blockquote>

<style>
	.blockquote :global(p) {
		margin-inline: auto;
		width: 85%;
	}
</style>
