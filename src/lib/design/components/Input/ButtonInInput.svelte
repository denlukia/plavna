<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createMouseWatcher } from '../../reactivity/mouse-watcher.svelte';
	import LayerFlashlight from '../ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '../ActiveElementFX/Layers.svelte';
	import LayerShift from '../ActiveElementFX/LayerShift.svelte';

	type Props = {
		children: Snippet;
		onclick?: () => void;
	};

	let { children, onclick = () => {} }: Props = $props();

	let { mouse, ...events } = createMouseWatcher();
</script>

<button
	class="button global-reset-button global-button-in-input global-fix-overflow"
	{...events}
	{onclick}
>
	<Layers overflow="hidden">
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
