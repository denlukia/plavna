<script lang="ts">
	import { createMouseWatcher } from '../../reactivity/mouse-watcher.svelte';
	import LayerFlashlight from '../ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '../ActiveElementFX/Layers.svelte';
	import LayerShift from '../ActiveElementFX/LayerShift.svelte';
	import { selectVariables } from './select-variables';
	import type { SwitchProps } from './types';

	let { checked = $bindable(), customSize = 'body', ...attributes }: SwitchProps = $props();

	let selectedVariables = $derived(
		selectVariables(
			customSize,
			(size) => `
			--size-switch-width: var(--size-switch-${size}-width);
			--size-switch-border-radius: var(--size-switch-${size}-border-radius);
			--size-switch-padding-to-handle: var(--size-switch-${size}-padding-to-handle);
			--size-switch-layer-flashlight-hover: var(--size-switch-${size}-layer-flashlight-hover);

			--size-switch-handle-width: var(--size-switch-${size}-handle-width);
			--size-switch-handle-height: var(--size-switch-${size}-handle-height);
			--size-switch-handle-border-radius: var(--size-switch-${size}-handle-border-radius);
			--size-switch-handle-active-width: var(--size-switch-${size}-handle-active-width);

			--border-switch-handle: var(--border-switch-${size}-handle);

			--transform-switch-checked-hover: var(--transform-switch-${size}-checked-hover);
			--transform-switch-checked-active: var(--transform-switch-${size}-checked-active);
			--transform-switch-handle-active: var(--transform-switch-${size}-handle-active);
			--transform-switch-checked-handle-active: var(--transform-switch-${size}-checked-handle-active);
			`
		)
	);

	let { mouse, ...events } = createMouseWatcher();
</script>

<label class="switch global-reset-line-height" style={selectedVariables}>
	<input bind:checked {...attributes} type="checkbox" />
	<span class="switch-visualizer" {...events}>
		<Layers>
			<LayerFlashlight {mouse} />
			<LayerShift {mouse}>
				<span class="layer-handle">
					<span class="handle"></span>
				</span>
			</LayerShift>
		</Layers>
	</span>
</label>

<style>
	.switch {
		display: inline-block;
		-webkit-user-select: none;
		user-select: none;
		position: relative;

		margin-top: var(--switch-margin-top);

		/* For Layers */
		--layers-border-radius: var(--size-switch-border-radius);
	}
	input {
		appearance: none;
		position: absolute;
	}

	.switch-visualizer {
		display: inline-block;
		background: var(--color-switch-bg);
		box-shadow: var(--shadow-switch);
		border-radius: var(--size-switch-border-radius);
		transition: all var(--transition-switch-duration) var(--transition-switch-easing);

		/* For LayerFlashlight */
		--transition-layer-flashlight: opacity var(--transition-switch-duration)
			var(--transition-switch-easing);
		--size-layer-flashlight-pointer: var(--size-switch-layer-flashlight-hover);
		--color-layer-flashlight-pointer: var(--color-switch-layer-flashlight-hover);
		--transition-layer-flashlight-pointer: background var(--transition-switch-duration)
			var(--transition-switch-easing);
	}

	.switch-visualizer:active .handle {
		width: var(--size-switch-handle-active-width);
	}

	.layer-handle {
		display: inline-block;
		width: var(--size-switch-width);
		padding: var(--size-switch-padding-to-handle);
	}

	.handle {
		display: inline-block;
		width: var(--size-switch-handle-width);
		height: var(--size-switch-handle-height);
		background: var(--color-switch-handle-bg);
		transition: all var(--transition-switch-duration) var(--transition-switch-easing);
		border-radius: var(--size-switch-handle-border-radius);
		border: var(--border-switch-handle);
		box-shadow: var(--shadow-switch-handle);
	}

	input:checked + .switch-visualizer {
		background: var(--color-switch-checked-bg);
		box-shadow: var(--shadow-switch-checked);

		/* For LayerFlashlight */
		--color-layer-flashlight-pointer: var(--color-switch-checked-layer-flashlight-hover);
	}
	input:checked + .switch-visualizer:hover {
		transform: var(--transform-switch-checked-hover);
		box-shadow: var(--shadow-switch-checked-hover);
	}
	input:checked + .switch-visualizer:active {
		transform: var(--transform-switch-checked-active);
		box-shadow: var(--shadow-switch-checked-active);
	}
	input:checked + .switch-visualizer .handle {
		transform: var(--transform-switch-handle-active);
	}
	input:checked + .switch-visualizer:active .handle {
		transform: var(--transform-switch-checked-handle-active);
	}
</style>
