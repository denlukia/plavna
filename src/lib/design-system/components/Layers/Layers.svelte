<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		tag?: 'span' | 'div';
		stretch?: boolean;
	};
	let { children, stretch = false, tag = 'span' } = $props<Props>();
</script>

<svelte:element this={tag} class="layers global-fix-overflow" class:stretch>
	{@render children()}
</svelte:element>

<style>
	.layers {
		display: grid;
		grid-template-areas: 'a';
		flex-grow: var(--layers-flex-grow);
		overflow: hidden;
		border-radius: var(--layers-border-radius);
	}
	/* We choose :global here to let any components be a layer */
	.layers > :global(*) {
		grid-area: a;
	}
	.stretch {
		height: 100%;
	}
	.stretch > :global(*) {
		height: 100%;
		width: 100%;
	}
</style>
