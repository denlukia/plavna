<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		tag?: 'span' | 'div';
	};
	let { children, tag = 'span' } = $props<Props>();
</script>

<svelte:element this={tag} class="layers global-fix-overflow">{@render children()}</svelte:element>

<style>
	.layers {
		display: grid;
		grid-template-areas: 'a';
		flex-grow: var(--layers-flex-grow);
	}
	/* We choose :global here to let any components be a layer */
	.layers > :global(*) {
		grid-area: a;
	}
</style>
