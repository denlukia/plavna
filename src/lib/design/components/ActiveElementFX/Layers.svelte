<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		children: Snippet;
		stretch?: boolean;
		overflow?: string;
	};
	let { children, stretch = false, overflow, ...attributes }: Props = $props();
</script>

<span
	class="layers global-fix-overflow"
	class:stretch
	style="overflow: {overflow};"
	{...attributes}
>
	{@render children()}
</span>

<style>
	.layers {
		display: grid;
		grid-template-areas: 'a';
		flex-grow: var(--layers-flex-grow);
		overflow: var(overflow);
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
