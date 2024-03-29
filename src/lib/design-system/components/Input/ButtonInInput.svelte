<script lang="ts">
	import type { Snippet } from 'svelte';

	import LayerFlashlight from '../(helpers)/LayerFlashlight.svelte';
	import Layers from '../(helpers)/Layers.svelte';
	import LayerShift from '../(helpers)/LayerShift.svelte';
	import { MouseWatcher } from '../(helpers)/MouseWatcher.svelte';

	type Props = {
		children: Snippet;
		onclick?: () => void;
	};

	let { children, onclick = () => {} }: Props = $props();

	let { mouse, ...events } = new MouseWatcher();
</script>

<button
	class="button global-reset-button global-button-in-input global-layer-flashlight-hover-trigger global-fix-overflow"
	{...events}
	{onclick}
>
	<Layers --overflow="hidden">
		<LayerFlashlight {mouse} />
		<LayerShift {mouse}>
			<div class="content-padder">
				{@render children()}
			</div>
		</LayerShift>
	</Layers>
</button>

<style>
	.button {
		--layers-border-radius: var(--size-button-in-input-border-radius);
	}
	.content-padder {
		padding-inline: var(--size-button-in-input-padding-inline);
		padding-top: var(--size-button-in-input-padding-top);
		padding-bottom: var(--size-button-in-input-padding-bottom);
	}
	/* See other styles in styles/global.css  */
	/* .global-button-in-input and other */
</style>
