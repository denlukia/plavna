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

<button
	class="global-button-reset global-button-in-input global-layer-fx-hover-trigger"
	{onmousemove}
	{onclick}
>
	<Layers>
		<LayerFx {mousePos} />
		<span class="layer-content">
			{@render children()}
		</span>
	</Layers>
</button>

<style>
	button {
		padding-inline: var(--size-button-in-input-padding-inline);
		padding-top: var(--size-button-in-input-padding-top);
		padding-bottom: var(--size-button-in-input-padding-bottom);
	}
	/* See other styles in styles/global.css  */
	/* .global-button-in-input and other */
</style>
