<script lang="ts">
	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';
	import Layers from '../Layers/Layers.svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';
	import type { SwitchProps } from './types';

	let { ...props } = $props<SwitchProps>();

	let { mouse, ...events } = new MouseWatcher();
</script>

<label>
	<input {...props} type="checkbox" />
	<span class="switch-visualizer global-line-height-reset global-" {...events}>
		<Layers>
			<LayerFlashlight {mouse} />
			<span class="layer-handle global-fix-overflow">
				<span class="handle" />
			</span>
		</Layers>
	</span>
</label>

<style>
	input {
		appearance: none;
	}

	.switch-visualizer {
		display: inline-flex;
		background: var(--color-switch-bg);
		box-shadow: var(--shadow-switch);
		border-radius: var(--size-switch-border-radius);
		width: var(--size-switch-width);
		height: var(--size-switch-height);
		transition: all var(--transition-switch-duration) var(--transition-switch-easing);
		overflow: hidden;
	}
	.switch-visualizer :global(.layer-flashlight) {
		transition: opacity var(--transition-switch-duration) var(--transition-switch-easing);
		--size-layer-flashlight-hover: var(--size-switch-layer-flashlight-hover);
		--color-layer-flashlight-hover: var(--color-switch-layer-flashlight-hover);
	}
	.switch-visualizer :global(.layer-flashlight .poiner-shade) {
		transition: background var(--transition-switch-duration) var(--transition-switch-easing);
	}

	.layer-handle {
		padding: var(--size-switch-padding-to-handle);
	}

	.handle {
		display: inline-block;
		width: var(--size-switch-handle-width);
		height: 100%;
		background: var(--color-switch-handle-bg);
		border-radius: var(--size-switch-handle-border-radius);
		transition: all var(--transition-switch-duration) var(--transition-switch-easing);
		border: var(--border-switch-handle);
		box-shadow: var(--shadow-switch-handle);
	}

	input:checked + .switch-visualizer {
		background: var(--color-switch-checked-bg);
		box-shadow: var(--shadow-switch-checked);
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

	input:checked + .switch-visualizer :global(.layer-flashlight) {
		--color-layer-flashlight-hover: var(--color-switch-checked-layer-flashlight-hover);
	}
</style>
