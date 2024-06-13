<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		rowspan?: number;
		colspan?: number;
		children?: Snippet;
	};

	let { colspan = 1, rowspan = 0, children, ...attributes }: Props = $props();
</script>

{#snippet content()}
	{#if children}
		{@render children()}
	{/if}
{/snippet}

<span class="cell global-reset-link" style="--rows-taken:{rowspan}; --cols-taken:{colspan}">
	<!-- Either we're drawing a grid (e.g of articles) -->
	{#if rowspan}
		<span class="height-sizer">
			<span class="content">
				{@render content()}
			</span>
		</span>
	{:else}
		<!-- Or we're drawing a columned flex container with possible subgrids -->
		<span class="subgrid-wrapper" style="--current-grid-cols-total:{colspan}" {...attributes}>
			{@render content()}
		</span>
	{/if}
</span>

<style>
	.cell {
		display: block;

		/* --max-width-base: calc(var(--cols-taken) * var(--size-cell-width));
		--max-width-gaps-to-subtract: calc((var(--current-grid-cols-total) - 1) * var(--size-cell-gap));
		--max-width-gaps-to-add: calc((var(--cols-taken) - 1) * var(--size-cell-gap));
		max-width: calc(
			var(--max-width-base) - var(--max-width-gaps-to-subtract) + var(--max-width-gaps-to-add)
		); */

		--width-base: calc(var(--cols-taken) / var(--current-grid-cols-total) * 100%);
		--width-gaps-to-subtract: calc(
			(var(--current-grid-cols-total) - var(--cols-taken)) / var(--current-grid-cols-total) *
				var(--size-cell-gap)
		);
		width: calc(var(--width-base) - var(--width-gaps-to-subtract));
	}
	.subgrid-wrapper {
		width: 100%;
		display: flex;
		flex-direction: var(--flex-direction);
		flex-wrap: wrap;
		gap: var(--size-cell-gap);
	}
	.height-sizer {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		--height-base: calc(var(--rows-taken) * var(--size-cell-height-unitless));
		--height-gaps: calc((var(--rows-taken) - 1) * var(--size-cell-gap-unitless));
		padding-top: calc(
			(var(--height-base) + var(--height-gaps)) / var(--size-cell-width-unitless) * 100%
		);
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
