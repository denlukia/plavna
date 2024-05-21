<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createMouseWatcher } from '../../reactivity/mouse-watcher.svelte';
	import LayerFlashlight from './LayerFlashlight.svelte';
	import Layers from './Layers.svelte';
	import LayerShift from './LayerShift.svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	let { mouse, ...events } = createMouseWatcher();
</script>

<Layers {...events} overflow="hidden">
	<LayerFlashlight {mouse} />
	<LayerShift {mouse}>
		{@render children()}
	</LayerShift>
</Layers>
