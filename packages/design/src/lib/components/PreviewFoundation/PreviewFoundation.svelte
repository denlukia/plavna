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
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		pointer-events: all;
	}
	.overflowing-content {
		top: calc(var(--size-cell-overflow) * -1);
		left: calc(var(--size-cell-overflow) * -1);
		right: calc(var(--size-cell-overflow) * -1);
		bottom: calc(var(--size-cell-overflow) * -1);

		pointer-events: none;
	}
</style>
