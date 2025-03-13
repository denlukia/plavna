<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		main?: Snippet;
		overflowing?: Snippet;
		artisticOverflow?: number;
	};

	let { main, overflowing, artisticOverflow = 0 }: Props = $props();
</script>

<span class="main-content">
	{@render main?.()}
</span>
<span class="overflowing-content" style="--artistic-overflow: {artisticOverflow}px;">
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
		top: calc(var(--artistic-overflow) * -1);
		left: calc(var(--artistic-overflow) * -1);
		right: calc(var(--artistic-overflow) * -1);
		bottom: calc(var(--artistic-overflow) * -1);

		pointer-events: none;
	}
</style>
