<script lang="ts">
	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';
	import LayerShift from '../Layers/LayerShift.svelte';
	import Layers from '../Layers/Layers.svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';
	import type { SwitchProps } from './types';

	let { ...props } = $props<SwitchProps>();

	let { mouse, ...events } = new MouseWatcher();
</script>

<label class="switch global-line-height-reset">
	<input {...props} type="checkbox" />
	<span class="switch-visualizer global-" {...events}>
		<Layers>
			<LayerFlashlight {mouse} />
			<LayerShift {mouse}>
				<span class="layer-handle global-fix-overflow">
					<span class="handle" />
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
		overflow: hidden;

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
		border-radius: var(--size-switch-handle-border-radius);
		transition: all var(--transition-switch-duration) var(--transition-switch-easing);
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
