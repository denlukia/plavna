<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	let { children } = $props<Props>();
</script>

<span class="layers">{@render children()}</span>

<style>
	.layers {
		display: grid;
		grid-template-areas: 'a';
	}
	.layers > :global(*) {
		grid-area: a;
	}
</style>
