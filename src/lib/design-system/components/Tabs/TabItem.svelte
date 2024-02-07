<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import Text from '$lib/design-system/components/Text.svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';
	import Layers from '../Layers/Layers.svelte';
	import LayerShift from '../Layers/LayerShift.svelte';
	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';
	import { fade } from 'svelte/transition';

	type Props = HTMLButtonAttributes & {
		children: Snippet;
		active?: boolean;
		size?: 'body' | 'small';
	};

	let { children, active = false, size = 'body', ...attributes } = $props<Props>();

	let { mouse, ...events } = new MouseWatcher();
</script>

<button
	class="tab-item global-fix-overflow global-button-reset"
	data-active-tab={active}
	class:active
	role="tab"
	{...attributes}
	{...events}
>
	<Layers>
		{#if active}
			<div
				class="layer-flashlight-wrapper"
				in:fade={{ duration: 150, delay: 100 }}
				out:fade={{ duration: 100 }}
			>
				<LayerFlashlight {mouse} />
			</div>
		{/if}
		<LayerShift {mouse}>
			<Text size="set-with-variables">
				{@render children()}
			</Text>
		</LayerShift>
	</Layers>
</button>

<style>
	.tab-item {
		overflow: hidden;
	}
	.tab-item.active {
		--size-layer-flashlight-hover: var(--size-tab-item-active-body-layer-flashlight-hover);
		--color-layer-flashlight-hover: var(--color-tab-item-active-layer-flashlight-hover);
	}
</style>
