<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		cols?: number;
		mobileCols?: number;
		children?: Snippet;
		customClass?: string;
		stretch?: boolean;
	};

	let {
		cols = 1,
		mobileCols = cols,
		children,
		customClass = '',
		stretch = false,
		style,
		...attributes
	}: Props = $props();
</script>

{#snippet content()}
	{#if children}
		{@render children()}
	{/if}
{/snippet}

<div
	class="column global-reset-link {customClass}"
	style="--cols:{cols}; {style}"
	{...attributes}
	class:stretch
>
	<div class="inner" style="--size-cols-total:{cols}; --size-cols-total-mobile:{mobileCols}">
		{@render content()}
	</div>
</div>

<style>
	.column {
		--final-cols: var(--size-cols-total);
		--subtract-gaps: calc(
			var(--size-cell-gap) * calc(calc(var(--final-cols) - var(--cols)) / var(--final-cols))
		);
		width: calc(var(--cols) / var(--final-cols) * 100% - var(--subtract-gaps));
	}
	@media (max-width: 1024px) {
		.column {
			--final-cols: var(--size-cols-total-mobile);
		}
	}
	.inner {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-cell-gap);
		align-content: flex-start;
	}

	.stretch {
		align-self: stretch;
	}
	.stretch .inner {
		height: 100%;
	}
</style>
