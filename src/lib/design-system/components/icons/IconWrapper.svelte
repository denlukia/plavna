<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicInOut, elasticInOut, linear, sineInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { derived } from 'svelte/store';

	type AnimationTypes =
		| { animated: true; playhead: number; frames: number; frameSize: number }
		| { animated?: false | undefined; playhead?: never; frames?: never; frameSize?: never };

	type Props = {
		children: Snippet;
		size?: 'body' | 'small';
	} & AnimationTypes;

	let {
		children,
		size = 'body',
		animated = false,
		playhead = 0,
		frames = 1,
		frameSize = 20
	} = $props<Props>();

	let tweenedPlayhead = tweened(playhead, { duration: 200 });
	let currentFrame = derived(tweenedPlayhead, (tweenedPlayhead: number) =>
		Math.floor(tweenedPlayhead * frames)
	);
	let currentShift = derived(currentFrame, (currentFrame: number) => {
		let shift = currentFrame * frameSize;
		let maxShift = (frames - 1) * frameSize;
		let bounded = Math.min(shift, maxShift);

		// Negative cause exactly transform -20px
		// should show a frame placed 20px from the left;
		return -bounded;
	});

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
		--shift: ${$currentShift}px;
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
	}
</style>
