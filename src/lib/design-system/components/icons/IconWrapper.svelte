<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tweened } from 'svelte/motion';

	type AnimationTypes =
		| { animated: true; playhead: number; steps: number }
		| { animated?: false | undefined; playhead?: never; steps?: never };

	type Props = {
		children: Snippet;
		size?: 'body' | 'small';
	} & AnimationTypes;

	let { children, size = 'body', animated = false, playhead = 0, steps = 0 } = $props<Props>();

	let tweenedPlayhead = tweened(playhead);

	$effect(() => {
		if (playhead !== undefined) {
			tweenedPlayhead.set(playhead);
		} else {
			tweenedPlayhead.set(0);
		}
	});
</script>

<div class={`icon size-${size} thickness-${size}`}>
	{@render children()}
</div>

<style>
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size-icon-body-size);
		height: var(--size-icon-body-size);
	}
	.icon > :global(svg) {
		max-height: 100%;
		max-width: 100%;
	}
</style>
