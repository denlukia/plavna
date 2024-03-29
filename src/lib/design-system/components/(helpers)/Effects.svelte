<script lang="ts">
	import type { Snippet } from 'svelte';

	import LayerFlashlight from './LayerFlashlight.svelte';
	import Layers from './Layers.svelte';
	import LayerShift from './LayerShift.svelte';
	import { MouseWatcher } from './MouseWatcher.svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	let { mouse, ...events } = new MouseWatcher();
</script>

<Layers {...events} --overflow="hidden">
	<LayerFlashlight {mouse} />
	<LayerShift {mouse}>
		{@render children()}
	</LayerShift>
</Layers>
