<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '../Layers.svelte';
	import LayerFx from '../LayerFX/LayerFX.svelte';
	import { MouseWatcher } from '../LayerFX/watcher.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import ArrowDown from '../icons/ArrowDown.svelte';

	type Props = {
		type?: 'default' | 'in-input';
		children: Snippet;
	};
	let { type = 'default', children } = $props<Props>();

	let { mousePos, onmousemove } = new MouseWatcher();
</script>

<label
	class={`main-wrapper global-layer-fx-hover-trigger type-${type}`}
	class:global-button-in-input={type === 'in-input'}
	{onmousemove}
>
	<Layers>
		<LayerFx {mousePos} />
		<select
			class={`
			global-select-reset 
			global-disable-default-outline 
			global-text-${type === 'in-input' ? 'small' : 'body'}`}
		>
			{@render children()}
		</select>
		<span class="arrow-positioner">
			<IconWrapper size={type === 'in-input' ? 'small' : 'body'}>
				<ArrowDown />
			</IconWrapper>
		</span>
	</Layers>
</label>

<style>
	.main-wrapper {
		position: relative;
		overflow: hidden;
	}

	.arrow-positioner {
		pointer-events: none;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.type-default {
		background: var(--color-select-bg);
		color: var(--color-select-text);
		box-shadow: var(--shadow-select);
		border-radius: var(--size-select-border-radius);
		transition: var(--transition-select);

		--color-layer-fx-hover: var(--color-select-layer-fx-hover);
	}

	.type-default:hover {
		box-shadow: var(--shadow-select-hover);
		transform: var(--transform-select-hover);
	}

	.type-default:active {
		box-shadow: var(--shadow-select-active);
		transform: var(--transform-select-active);
	}

	.type-default select {
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
		top: 1px;
	}

	.type-in-input select {
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
