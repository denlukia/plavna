<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		main?: Snippet;
		overflowing?: Snippet;
	};

	let { main, overflowing }: Props = $props();
</script>

<span class="main-content">
	{@render main?.()}
</span>
<span class="overflowing-content">
	{@render overflowing?.()}
</span>

<style>
	.main-content,
	.overflowing-content {
		position: absolute;
	}
	.main-content {
		top: var(--size-cell-overflow);
		left: var(--size-cell-overflow);
		right: var(--size-cell-overflow);
		bottom: var(--size-cell-overflow);

		pointer-events: all;
	}
	.overflowing-content {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		pointer-events: none;
	}
</style>
