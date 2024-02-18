<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '../Layers/Layers.svelte';
	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';
	import LayerShift from '../Layers/LayerShift.svelte';

	type Props = {
		children: Snippet;
		onclick?: () => void;
	};

	let { children, onclick = () => {} } = $props<Props>();

	let { mouse, ...events } = new MouseWatcher();
</script>

<button
	class="global-reset-button global-button-in-input global-layer-flashlight-hover-trigger global-fix-overflow"
	{...events}
	{onclick}
>
	<Layers>
		<LayerFlashlight {mouse} />
		<LayerShift {mouse}>
			{@render children()}
		</LayerShift>
	</Layers>
</button>

<style>
	button {
		padding-inline: var(--size-button-in-input-padding-inline);
		padding-top: var(--size-button-in-input-padding-top);
		padding-bottom: var(--size-button-in-input-padding-bottom);
		overflow: hidden;
	}
	/* See other styles in styles/global.css  */
	/* .global-button-in-input and other */
</style>
