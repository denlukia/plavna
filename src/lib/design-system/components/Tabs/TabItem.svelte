<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';
	import Text from '$lib/design-system/components/Text.svelte';

	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';
	import Layers from '../Layers/Layers.svelte';
	import LayerShift from '../Layers/LayerShift.svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';

	type Props = HTMLButtonAttributes & {
		children: Snippet;
		active?: boolean;
		size?: 'body' | 'small';
		href?: string;
	};

	let { children, href, active = false, size = 'body', ...attributes } = $props<Props>();

	let { mouse, ...events } = new MouseWatcher();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	class="tab-item global-fix-overflow global-reset-button global-reset-link"
	data-active-tab={active}
	class:active
	role="tab"
	{href}
	{...attributes}
	{...events}
>
	<Layers>
		<LayerShift mouse={{ ...mouse, hovered: !active && mouse.hovered }}>
			<Text size="set-with-variables">
				{@render children()}
			</Text>
		</LayerShift>
	</Layers>
</svelte:element>

<style>
	.tab-item {
		padding-top: var(--tab-item-padding-top);
		padding-bottom: var(--tab-item-padding-bottom);
		padding-inline: var(--tab-item-padding-inline);
	}
	.tab-item.active {
		background: var(--active-tab-item-background);
		box-shadow: var(--active-tab-item-box-shadow);
		border-radius: var(--active-tab-item-border-radius);

		--size-layer-flashlight-pointer: var(--size-tab-item-active-body-layer-flashlight-hover);
		--color-layer-flashlight-pointer: var(--color-tab-item-active-layer-flashlight-hover);
	}
</style>
