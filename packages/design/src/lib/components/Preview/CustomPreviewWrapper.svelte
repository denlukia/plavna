<script lang="ts">
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import type { Snippet } from 'svelte';

	type Props = {
		main?: Snippet;
		overflowing?: Snippet;
		artisticOverflow?: number;
	};

	let { main, overflowing, artisticOverflow = ARTISTIC_OVERFLOW }: Props = $props();
</script>

<div class="preview-root">
	<div class="main">
		{@render main?.()}
	</div>
	<div class="overflowing" style="--padding: {artisticOverflow}px">
		{@render overflowing?.()}
	</div>
</div>

<style>
	.preview-root {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.main,
	.overflowing {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.overflowing {
		padding: var(--padding);
		pointer-events: none;
	}
</style>
