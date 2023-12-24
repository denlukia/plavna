<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '../Layers.svelte';
	import LayerFx from '../LayerFX/LayerFX.svelte';
	import { MouseWatcher } from '../LayerFX/watcher.svelte';

	type Props = {
		children: Snippet;
	};

	let { children } = $props<Props>();

	let { mousePos, onmousemove } = new MouseWatcher();
</script>

<button class="global-button-reset" {onmousemove}>
	<Layers>
		<LayerFx {mousePos} />
		<div class="layer-content">
			{@render children()}
		</div>
	</Layers>
</button>

<style>
	button {
		border-radius: var(--size-button-in-input-border-radius);
		background-color: var(--color-button-in-input-bg);
		box-shadow: var(--shadow-button-in-input);
		height: var(--size-button-in-input-height);
	}
</style>
