<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '../Layers.svelte';
	import LayerFx from '../LayerFX/LayerFX.svelte';
	import { MouseWatcher } from '../LayerFX/watcher.svelte';

	type Props = {
		children: Snippet;
		onclick?: () => void;
	};

	let { children, onclick = () => {} } = $props<Props>();

	let { mousePos, onmousemove } = new MouseWatcher();
</script>

<button class="global-button-reset" {onmousemove} {onclick}>
	<Layers>
		<LayerFx {mousePos} />
		<span class="layer-content">
			{@render children()}
		</span>
	</Layers>
</button>

<style>
	button {
		border-radius: var(--size-button-in-input-border-radius);
		background-color: var(--color-button-in-input-bg);
		box-shadow: var(--shadow-button-in-input);
		height: var(--size-button-in-input-height);
		transition: var(--transition-button-in-input);

		--color-layer-fx-hover: var(--color-button-in-input-layer-fx-hover);
		--size-layer-fx-hover: var(--size-button-in-input-layer-fx-hover);
		--transition-layer-fx-hover: var(--transition-button-in-input-layer-fx-hover);
	}
	button:hover {
		transform: var(--transform-button-in-input-hover);
		box-shadow: var(--shadow-button-in-input-hover);
	}

	button:hover > :global(.layers > .layer-fx) {
		opacity: 1;
	}

	button:active {
		transform: var(--transform-button-in-input-active);
		box-shadow: var(--shadow-button-in-input-active);
	}
</style>
