<script lang="ts">
	import type { Snippet } from 'svelte';

	import ArrowDown from './(icons)/ArrowDown.svelte';
	import IconWrapper from './(icons)/IconWrapper.svelte';
	import LayerFlashlight from './Layers/LayerFlashlight.svelte';
	import Layers from './Layers/Layers.svelte';
	import LayerShift from './Layers/LayerShift.svelte';
	import { MouseWatcher } from './Layers/watcher.svelte';

	type Props = {
		type?: 'default' | 'in-input';
		label?: Snippet;
		children: Snippet;
		disclosure?: boolean;
		opened?: boolean;
	};
	let { type = 'default', disclosure = false, opened = false, label, children } = $props<Props>();

	let { mouse, ...events } = new MouseWatcher();

	function onclick(e: MouseEvent) {
		if (disclosure) {
			opened = !opened;
		}
	}
</script>

<svelte:element
	this={disclosure ? 'button' : 'label'}
	role={disclosure ? 'button' : 'listbox'}
	class={`
		main-wrapper 
		global-layer-flashlight-hover-trigger 
		${disclosure ? 'global-reset-button' : ''}
		type-${type}`}
	class:global-button-in-input={type === 'in-input'}
	{...events}
	{onclick}
>
	<Layers>
		<LayerFlashlight {mouse} />
		<LayerShift {mouse}>
			<svelte:element
				this={disclosure ? 'span' : 'select'}
				role={disclosure ? 'button' : 'listbox'}
				class={`
					dropdown
					global-disable-default-outline 
					${disclosure ? '' : 'global-reset-select'}
					global-text-${type === 'in-input' ? 'small' : 'body'}`}
			>
				{#if label}
					{@render label()}
				{/if}

				{#if !disclosure}
					{@render children()}
				{/if}
			</svelte:element>
			<span class="arrow-positioner">
				<IconWrapper size={type === 'in-input' ? 'small' : 'body'}>
					<ArrowDown />
				</IconWrapper>
			</span>
		</LayerShift>
	</Layers>
	{#if disclosure && opened}
		<div class="box-positioner" on:mousemove={(e) => e.stopPropagation()} role="none">
			{@render children()}
		</div>
	{/if}
</svelte:element>

<style>
	/* General */
	.main-wrapper {
		position: relative;
		display: inline-block;
		background: var(--color-select-bg);
		color: var(--color-select-text);
		box-shadow: var(--shadow-select);
		border-radius: var(--size-select-border-radius);
		transition: var(--transition-select);

		--layers-border-radius: var(--size-select-border-radius);
		--color-layer-flashlight-pointer: var(--color-select-layer-flashlight-hover);
	}
	.main-wrapper:hover {
		box-shadow: var(--shadow-select-hover);
		transform: var(--transform-select-hover);
	}
	.main-wrapper:active {
		box-shadow: var(--shadow-select-active);
		transform: var(--transform-select-active);
	}

	.arrow-positioner {
		pointer-events: none;
		position: absolute;
		top: 1px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.dropdown {
		display: inline-block;
	}

	.box-positioner {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 100%);
	}

	/* Type Specific */
	.type-default .dropdown {
		padding-inline-start: var(--size-select-padding-inline);
		padding-inline-end: calc(
			var(--size-select-padding-inline) * 1.5 + var(--size-select-icon-width)
		);
		padding-top: var(--size-select-padding-top);
		padding-bottom: var(--size-select-padding-bottom);
	}

	.type-default .arrow-positioner {
		width: var(--size-select-icon-width);
		right: var(--size-select-padding-inline);
	}

	.type-in-input .dropdown {
		padding-inline-start: var(--size-select-in-input-padding-inline);
		padding-inline-end: calc(
			var(--size-select-in-input-padding-inline) * 1.2 + var(--size-select-in-input-icon-width)
		);
		padding-top: var(--size-select-in-input-padding-top);
		padding-bottom: var(--size-select-in-input-padding-bottom);
	}

	.type-in-input .arrow-positioner {
		width: var(--size-select-in-input-icon-width);
		right: var(--size-select-in-input-padding-inline);
	}
</style>
