<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children } = $props<Props>();
</script>

<div class="perspective-wrapper">
	{@render children()}
</div>

<style>
	.perspective-wrapper {
		perspective: 1000px;
		perspective-origin: 50% 50%;
	}
</style>
