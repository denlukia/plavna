<script lang="ts">
	import { Typography } from '@plavna/design/components';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { createMouseWatcher } from '../../reactivity/mouse-watcher.svelte';
	import Layers from '../ActiveElementFX/Layers.svelte';
	import LayerShift from '../ActiveElementFX/LayerShift.svelte';

	type Props = HTMLButtonAttributes & {
		children: Snippet;
		active?: boolean;
		size?: 'body' | 'small';
		href?: string;
	};

	let { children, href, active = false, size = 'body', ...attributes }: Props = $props();

	let { mouse, ...events } = createMouseWatcher();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	class="tab-item global-reset-button global-reset-link"
	data-active-tab={active}
	class:active
	role="tab"
	{href}
	{...attributes}
	{...events}
>
	<Layers>
		<LayerShift mouse={{ ...mouse, hovered: !active && mouse.hovered }}>
			<Typography size="set-with-variables" bold>
				{@render children()}
			</Typography>
		</LayerShift>
	</Layers>
</svelte:element>

<style>
	.tab-item {
		padding-top: var(--tab-item-padding-top);
		padding-bottom: var(--tab-item-padding-bottom);
		padding-inline: var(--tab-item-padding-inline);

		/* For Layers */
		--layers-border-radius: 0;
	}
	.tab-item.active {
		background: var(--active-tab-item-background);
		box-shadow: var(--active-tab-item-box-shadow);
		border-radius: var(--active-tab-item-border-radius);

		--size-layer-flashlight-pointer: var(--size-tab-item-active-body-layer-flashlight-hover);
		--color-layer-flashlight-pointer: var(--color-tab-item-active-layer-flashlight-hover);
	}
</style>
