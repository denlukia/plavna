<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		rows: number;
		cols: number;
		children?: Snippet;
		customClass?: string;
	};

	let { cols = 1, rows = 1, children, customClass = '' }: Props = $props();
</script>

{#snippet content()}
	{#if children}
		{@render children()}
	{/if}
{/snippet}

<span class="cell global-reset-link {customClass}" style="--rows:{rows}; --cols:{cols}">
	<span class="content">
		{@render content()}
	</span>
</span>

<style>
	.cell {
		display: block;

		--width-main: calc(var(--cols) * var(--size-cell-width));
		--height-main: calc(var(--rows) * var(--size-cell-height));
		--width-added-gaps: calc(calc(var(--cols) - 1) * var(--size-cell-gap));
		--height-added-gaps: calc(calc(var(--rows) - 1) * var(--size-cell-gap));

		width: calc(var(--width-main) + var(--width-added-gaps));
		height: calc(var(--height-main) + var(--height-added-gaps));

		position: relative;
		align-items: stretch;
	}

	.content {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
