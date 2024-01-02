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
		frames = 0,
		frameSize = 0
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

<span class={`icon size-${size} thickness-${size}`}>
	<span
		class="icon-frame"
		style={`
		--svg-width: ${frames ? frames * frameSize + 'px' : '100%'};
		--svg-height: ${frameSize ? frameSize + 'px' : '100%'};
		--frame-width: ${frameSize ? frameSize + 'px' : '100%'};
		--frame-height: ${frameSize ? frameSize + 'px' : '100%'};
		--shift: ${$currentShift}px;
		`}>{@render children()}</span
	>
</span>

<style>
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.icon-frame {
		overflow: hidden;
		width: var(--frame-width);
		height: var(--frame-height);
	}
	.icon-frame > :global(svg) {
		width: var(--svg-width);
		height: var(--svg-height);
		transform: translateX(var(--shift));
	}

	.size-body {
		width: var(--size-icon-body-size);
		height: var(--size-icon-body-size);
	}
	.size-small {
		width: var(--size-icon-small-size);
		height: var(--size-icon-small-size);
	}

	.thickness-body {
		--svg-stroke-width: var(--size-icon-body-stroke-width);
	}
	.thickness-small {
		--svg-stroke-width: var(--size-icon-small-stroke-width);
	}
</style>
