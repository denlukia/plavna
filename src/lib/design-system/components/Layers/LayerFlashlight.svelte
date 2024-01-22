<script lang="ts">
	import type { MouseState } from './watcher.svelte';

	type Props = {
		mouse: MouseState;
	};
	let { mouse } = $props<Props>();
</script>

<span class="layer-flashlight">
	<span class="poiner-shade" style="--pointer-x: {mouse.x}; --pointer-y: {mouse.y}" />
</span>

<style>
	.poiner-shade {
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
		width: var(--size-layer-flashlight-hover);
		height: var(--size-layer-flashlight-hover);
		border-radius: var(--size-full);
		background: var(--color-layer-flashlight-hover);
		transform: translate(
			calc(calc(var(--pointer-x) * 1px) - 50%),
			calc(calc(var(--pointer-y) * 1px) - 50%)
		);
	}
	.layer-flashlight {
		pointer-events: none;
		opacity: 0;
		z-index: -1;
		transition: var(--transition-layer-flashlight-hover);
	}
</style>
