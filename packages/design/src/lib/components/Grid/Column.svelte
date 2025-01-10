<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		cols?: number;
		children?: Snippet;
		customClass?: string;
		stretch?: boolean;
	};

	let {
		cols = 1,
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
	<div class="inner" style="--size-cols-total:{cols}">
		{@render content()}
	</div>
</div>

<style>
	.column {
		--subtract-gaps: calc(
			var(--size-cell-gap) *
				calc(calc(var(--size-cols-total) - var(--cols)) / var(--size-cols-total))
		);
		width: calc(var(--cols) / var(--size-cols-total) * 100% - var(--subtract-gaps));
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
