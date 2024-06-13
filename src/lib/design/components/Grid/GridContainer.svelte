<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		maxRows?: number;
		direction?: 'row' | 'column';
	};

	let { children, maxRows, direction = 'row', ...attributes }: Props = $props();
</script>

<div
	class="grid-container"
	{...attributes}
	style="--max-rows: {maxRows}; --flex-direction: {direction};"
>
	{@render children()}
</div>

<style>
	.grid-container {
		display: flex;
		flex-direction: var(--flex-direction);
		flex-wrap: wrap;
		align-items: flex-start;

		gap: var(--size-cell-gap);

		--max-height-base: calc(var(--max-rows) * var(--size-cell-height));
		--max-height-gaps: calc(var(--max-rows) * var(--size-cell-gap));
		max-height: calc(var(--max-height-base) + var(--max-height-gaps));

		--current-grid-cols-total: var(--count-cols-total);
	}
</style>
