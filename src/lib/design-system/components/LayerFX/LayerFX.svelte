<script lang="ts">
	type Props = {
		mousePos: { x: number; y: number };
	};
	let { mousePos } = $props<Props>();
</script>

<span class="layer-fx">
	<span class="poiner-shade" style="--pointer-x: {mousePos.x}; --pointer-y: {mousePos.y}" />
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
		width: var(--size-layer-fx-hover);
		height: var(--size-layer-fx-hover);
		border-radius: var(--size-full);
		background: var(--color-layer-fx-hover);
		transform: translate(
			calc(calc(var(--pointer-x) * 1px) - 50%),
			calc(calc(var(--pointer-y) * 1px) - 50%)
		);
	}
	.layer-fx {
		pointer-events: none;
		opacity: 0;
		z-index: -1;
		transition: var(--transition-layer-fx-hover);
	}
</style>
