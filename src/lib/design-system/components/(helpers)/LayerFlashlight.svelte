<script lang="ts">
	import type { MouseState } from './MouseWatcher.svelte';

	type Props = {
		mouse: MouseState;
	};
	let { mouse }: Props = $props();
</script>

<span class="layer-flashlight" class:hovered={mouse.hovered}>
	<span class="poiner" style="--pointer-x: {mouse.x}; --pointer-y: {mouse.y}" />
</span>

<style>
	.layer-flashlight {
		pointer-events: none;
		opacity: 0;
		transition: var(--transition-layer-flashlight);
	}
	.layer-flashlight.hovered {
		opacity: 1;
	}
	.poiner {
		display: block;
		--mask-image: radial-gradient(
			circle,
			hsla(0, 0%, 100%, 1) 0%,
			hsla(0, 0%, 100%, 0.9) 20%,
			hsla(0, 0%, 100%, 0.1) 65%,
			hsla(0, 0%, 100%, 0.025) 80%,
			hsla(0, 0%, 100%, 0) 100%
		);
		-webkit-mask-image: var(--mask-image);
		mask-image: var(--mask-image);

		position: absolute;
		top: var(--pointer-y);
		left: var(--pointer-x);
		width: var(--size-layer-flashlight-pointer);
		height: var(--size-layer-flashlight-pointer);
		border-radius: var(--size-full);
		background: var(--color-layer-flashlight-pointer);
		transform: translate(
			calc(calc(var(--pointer-x) * 1px) - 50%),
			calc(calc(var(--pointer-y) * 1px) - 50%)
		);

		/* In Switch component we need background to transition in color  */
		transition: var(--transition-layer-flashlight-pointer);
	}
</style>
