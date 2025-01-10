<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="perspective-wrapper">
	{@render children()}
</div>

<style>
	.perspective-wrapper {
		perspective: 400px;
		perspective-origin: top center;
	}
</style>
