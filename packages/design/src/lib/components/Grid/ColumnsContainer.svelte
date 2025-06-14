<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		rows?: number;
	};

	let { children, rows, style, ...attributes }: Props = $props();
</script>

<div
	class="columns-container"
	{...attributes}
	style={`${style} ${rows ? `--size-rows-total: ${rows};` : ''}`}
>
	{@render children()}
</div>

<style>
	.columns-container {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;

		gap: var(--size-cell-gap);
	}
</style>
