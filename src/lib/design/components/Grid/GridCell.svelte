<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		rowspan?: number;
		colspan?: number;
		children?: Snippet;
	};

	let { colspan = 1, rowspan = 0, children }: Props = $props();
</script>

{#snippet content()}
	{#if children}
		{@render children()}
	{/if}
{/snippet}

<span class="cell global-reset-link" style="--rows-taken:{rowspan}; --cols-taken:{colspan}">
	{#if rowspan}
		<span class="height-sizer">
			<span class="content">
				{@render content()}
			</span>
		</span>
	{:else}
		{@render content()}
	{/if}
</span>

<style>
	.cell {
		display: block;

		--max-width-base: calc(var(--cols-taken) * var(--size-cell-width));
		--max-width-gaps: calc((var(--cols-taken) - 1) * var(--size-cell-gap));
		max-width: calc(var(--max-width-base) + var(--max-width-gaps));

		--width-base: calc(var(--cols-taken) / var(--count-cols-total) * 100%);
		--width-gaps: calc((var(--cols-taken) - 1) * var(--size-cell-gap));
		--width-layout-paddings: var(--size-main-layout-padding-inline) * 2;
		width: var(--width-base);
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
