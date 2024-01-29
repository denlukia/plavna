<script lang="ts">
	import type { Snippet } from 'svelte';

	type AnimationTypes =
		| { currentFrame: number; frames: number; frameSize: number }
		| { currentFrame?: never; frames?: never; frameSize?: never };

	type Props = {
		children: Snippet;
		size?: 'body' | 'small' | 'body-big';
	} & AnimationTypes;

	let { children, size = 'body', currentFrame = 0, frames = 1, frameSize = 20 } = $props<Props>();
</script>

<span
	class={`icon-frame`}
	style={`
		width: var(--size-icon-${size}-size);
		height: var(--size-icon-${size}-size);
		--svg-width: calc(var(--size-icon-${size}-size) * ${frames});
		--svg-height: var(--size-icon-${size}-size);
		--svg-stroke-width: calc(${frameSize} / var(--size-icon-${size}-size-unitless) * var(--size-icon-${size}-stroke-width));
		--shift: calc(${Math.floor(currentFrame)} * var(--size-icon-${size}-size-unitless) * -1px);
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
