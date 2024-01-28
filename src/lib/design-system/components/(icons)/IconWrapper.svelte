<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicInOut, elasticInOut, linear, sineInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { derived } from 'svelte/store';

	type AnimationTypes =
		| { playhead: number; frames: number; frameSize: number }
		| { playhead?: never; frames?: never; frameSize?: never };

	type Props = {
		children: Snippet;
		size?: 'body' | 'small' | 'body-big';
	} & AnimationTypes;

	let { children, size = 'body', playhead = 0, frames = 1, frameSize = 20 } = $props<Props>();

	let tweenedPlayhead = tweened(playhead, { duration: 200 });
	let currentFrame = derived(tweenedPlayhead, (tweenedPlayhead: number) =>
		Math.min(Math.floor(tweenedPlayhead * frames), frames - 1)
	);

	$effect(() => {
		if (playhead !== undefined) {
			tweenedPlayhead.set(playhead);
		} else {
			tweenedPlayhead.set(0);
		}
	});
</script>

<span
	class={`icon-frame`}
	style={`
		width: var(--size-icon-${size}-size);
		height: var(--size-icon-${size}-size);
		--svg-width: calc(var(--size-icon-${size}-size) * ${frames});
		--svg-height: var(--size-icon-${size}-size);
		--svg-stroke-width: calc(${frameSize} / var(--size-icon-${size}-size-unitless) * var(--size-icon-${size}-stroke-width));
		--shift: calc(${$currentFrame} * var(--size-icon-${size}-size-unitless) * -1px);
		`}
>
	{@render children()}
</span>

<style>
	.icon-frame {
		display: inline-block;
		overflow: hidden;
	}
	.icon-frame > :global(svg) {
		width: var(--svg-width);
		height: var(--svg-height);
		transform: translateX(var(--shift));
		--svg-main-color: currentcolor;
	}
</style>
