<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		maxRows?: number;
		direction?: 'row' | 'column';
		withPaddingInline?: boolean;
	};

	let {
		children,
		maxRows,
		direction = 'row',
		withPaddingInline = false,
		...attributes
	}: Props = $props();

	let rowsTotalCSSVariable = maxRows ? `--size-rows-total: ${maxRows};` : '';
</script>

<div
	class="grid-container {withPaddingInline ? 'with-padding-inline' : ''}"
	{...attributes}
	style="--flex-direction: {direction}; {rowsTotalCSSVariable}"
>
	{@render children()}
</div>

<style>
	.grid-container {
		display: flex;
		flex-direction: var(--flex-direction);
		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;

		gap: var(--size-cell-gap);

		--max-height-base: calc(var(--size-rows-total) * var(--size-cell-height));
		--max-height-gaps: calc(var(--size-rows-total) * var(--size-cell-gap));
		--max-height: calc(var(--max-height-base) + var(--max-height-gaps));

		max-height: var(--max-height);

		--size-cols-total: var(--size-cols-total);
	}

	.with-padding-inline {
		padding-inline: var(--size-main-grid-padding-inline);
	}

	.with-padding-inline > :global(*:last-child) {
		display: flex;
	}
	.with-padding-inline > :global(*:last-child:after) {
		content: '.';
		visibility: hidden;
		width: var(--size-main-grid-padding-inline);
	}
</style>
