<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tweened } from 'svelte/motion';

	import type { MouseState } from '../../reactivity/mouse-watcher.svelte';

	type Props = {
		mouse: MouseState;

		children: Snippet;
	};
	let { mouse, children }: Props = $props();

	let boxSize = $state({ width: Number.POSITIVE_INFINITY, height: Number.POSITIVE_INFINITY });
	let shiftMultiplier = tweened(0, { duration: 300 });
	$effect(() => {
		if (mouse.hovered) {
			shiftMultiplier.set(1);
		} else {
			shiftMultiplier.set(0);
		}
	});
	let shift = $derived({
		x: $shiftMultiplier * (mouse.x / boxSize.width - 0.5),
		y: $shiftMultiplier * (mouse.y / boxSize.height - 0.5)
	});
</script>

<span
	class="layer-shift"
	bind:clientWidth={boxSize.width}
	bind:clientHeight={boxSize.height}
	style="--shift-x: {shift.x}; --shift-y: {shift.y}"
>
	{@render children()}
</span>

<style>
	.layer-shift {
		display: inline-block;
		transform: translate(
			calc(var(--shift-x) * var(--size-layer-shift-hover-translate)),
			calc(var(--shift-y) * var(--size-layer-shift-hover-translate))
		);
	}
</style>
