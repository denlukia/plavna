<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '../Layers.svelte';
	import LayerFx from '../LayerFX/LayerFX.svelte';
	import { MouseWatcher } from '../LayerFX/watcher.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import ArrowDown from '../icons/ArrowDown.svelte';

	type Props = {
		insideInput?: boolean;
		children: Snippet;
	};
	let { insideInput = false, children } = $props<Props>();

	let { mousePos, onmousemove } = new MouseWatcher();
</script>

<label class:global-button-in-input={insideInput} {onmousemove}>
	<Layers>
		<LayerFx {mousePos} />
		<select
			class="global-select-reset global-text-small global-disable-default-outline"
			class:select-in-input={insideInput}
		>
			{@render children()}
		</select>
		<span class="arrow-positioner">
			<IconWrapper size="small">
				<ArrowDown />
			</IconWrapper>
		</span>
	</Layers>
</label>

<style>
	label {
		position: relative;
	}

	.arrow-positioner {
		pointer-events: none;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: var(--select-in-input-icon-width);
		right: var(--select-in-input-padding-inline);
	}

	select {
		display: inline-block;
	}
	.select-in-input {
		padding-inline-start: var(--select-in-input-padding-inline);
		padding-inline-end: calc(
			var(--select-in-input-padding-inline) + var(--select-in-input-icon-width)
		);
		padding-top: var(--select-in-input-padding-top);
		padding-bottom: var(--select-in-input-padding-bottom);
	}
</style>
