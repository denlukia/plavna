<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		rows: number;
		cols: number;
		mobileCols?: number;
		mobileRows?: number;
		children?: Snippet;
		customClass?: string;
	};

	let {
		cols = 1,
		rows = 1,
		mobileCols = cols,
		mobileRows = rows,
		children,
		customClass = ''
	}: Props = $props();
</script>

{#snippet content()}
	{#if children}
		{@render children()}
	{/if}
{/snippet}

<div class="cell-padding-wrapper">
	<div
		class="cell global-reset-link {customClass}"
		style="--rows:{rows}; --cols:{cols}; --mobile-cols:{mobileCols}; --mobile-rows:{mobileRows};"
	>
		<div class="content">
			{@render content()}
		</div>
	</div>
</div>

<style>
	.cell-padding-wrapper {
		display: flex;
	}
	.cell {
		--cols-capped: min(var(--cols), var(--size-cols-total));
		--rows-capped: min(var(--rows), var(--size-rows-total));

		--width-main: calc(var(--cols-capped) * var(--size-cell-width));
		--height-main: calc(var(--rows-capped) * var(--size-cell-height));
		--width-added-gaps: calc(calc(var(--cols-capped) - 1) * var(--size-cell-gap));
		--height-added-gaps: calc(calc(var(--rows-capped) - 1) * var(--size-cell-gap));

		width: calc(var(--width-main) + var(--width-added-gaps));
		height: calc(var(--height-main) + var(--height-added-gaps));

		position: relative;
		align-items: stretch;
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
