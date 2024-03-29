<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	import Tail from './Tail.svelte';

	type Props = {
		children: Snippet;
		withGaps?: boolean;
	};

	let { children, withGaps = false }: Props = $props();
</script>

<div
	class="box-wrapper"
	transition:scale={{ duration: 250, opacity: 0, start: 0.75, easing: cubicOut }}
>
	<div class="tail-wrapper"><Tail /></div>
	<div class="box" class:with-gaps={withGaps}>
		{@render children()}
	</div>
</div>

<style>
	.box-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 2px;
		transform-origin: top center;
	}
	.box {
		min-width: 100px;
		display: flex;
		flex-direction: column;
		background: var(--color-box-bg);
		border-radius: var(--size-box-border-radius);
		box-shadow: var(--shadow-box);
		padding-top: var(--size-box-padding-top);
		padding-bottom: var(--size-box-padding-bottom);
		padding-inline: var(--size-box-padding-inline);
	}
	.tail-wrapper {
		color: var(--color-box-bg);
		width: 50px;
		height: 15px;
		z-index: 1;
	}
	.tail-wrapper > :global(svg) {
		width: 100%;
		height: 100%;
	}
	.with-gaps {
		gap: var(--size-box-gap);
	}
</style>
