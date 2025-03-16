<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		children: Snippet;
		stretch?: boolean;
		overflow?: string;
		inline?: boolean;
	};
	let {
		children,
		stretch = false,
		overflow = 'hidden',
		inline = false,
		style,
		...attributes
	}: Props = $props();
</script>

<span
	class="layers"
	class:stretch
	class:inline
	style="overflow: {overflow}; {style}"
	{...attributes}
>
	{@render children()}
</span>

<style>
	.layers {
		display: grid;
		grid-template-areas: 'a';
		flex-grow: var(--layers-flex-grow);
		border-radius: var(--layers-border-radius);
	}
	.inline {
		display: inline-grid;
	}
	/* We choose :global here to let any components be a layer */
	.layers > :global(*),
	.layers > :global(.global-display-contents > *) {
		grid-area: a;
		max-width: 100%;
		max-height: 100%;
	}

	.stretch {
		height: 100%;
	}
	.stretch > :global(*) {
		height: 100%;
	}
</style>
