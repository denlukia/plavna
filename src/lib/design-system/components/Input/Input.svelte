<script lang="ts">
	import LayerFX from '../LayerFX/LayerFX.svelte';
	import { MouseWatcher } from '../LayerFX/watcher.svelte';
	import Layers from '../Layers.svelte';
	import Eye from '../icons/Eye.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import ButtonInInput from './ButtonInInput.svelte';

	type Props = {
		languaged?: boolean;
		type?: 'text' | 'image' | 'password' | 'email';
	};
	let { type = 'text', languaged = false } = $props<Props>();
	let { mousePos, onmousemove } = new MouseWatcher();

	let pswdIconPlayhead = $state(0);
</script>

<!-- TODO: What would the correct role be? -->
<span class="input-whole" {onmousemove} role="presentation">
	<Layers>
		<LayerFX {mousePos} />
		<span class="layer-content">
			<span class="input-wrapper">
				<input {type} class="global-text-body" />
			</span>
			<span class="buttons-wrapper">
				{#if type === 'password'}
					<ButtonInInput>
						<IconWrapper animated playhead={pswdIconPlayhead} steps={10}>
							<Eye />
						</IconWrapper>
					</ButtonInInput>
				{/if}
			</span>
		</span>
	</Layers>
</span>

<style>
	/* Reset */
	input {
		border: none;
		background: none;
		margin: 0;
		min-width: 0;
		width: 100%;
	}

	input:focus {
		outline: none;
	}

	/* General */
	.input-whole {
		display: inline-block;
		width: var(--size-input-width);
		background-color: var(--color-input-bg);
		box-shadow: var(--shadow-input);
		border-radius: var(--size-input-border-radius);
		overflow: hidden;
		transform: translate(0, 0);

		/* For LayerFX Hover */
		--size-layer-fx-hover: var(--size-input-layer-fx-hover);
		--color-layer-fx-hover: var(--color-input-layer-fx-hover);
		--transition-layer-fx-hover: var(--transition-input-layer-fx-hover);
	}

	.input-whole:hover > :global(.layers > .layer-fx) {
		opacity: 1;
	}

	.input-wrapper {
		padding-inline: var(--size-input-padding-inline);
		padding-top: var(--size-input-padding-top);
		padding-bottom: var(--size-input-padding-bottom);
	}
	.layer-content {
		display: flex;
	}
	.buttons-wrapper {
		display: flex;
		align-items: flex-start;
		padding: var(--size-input-to-button-padding);
	}
</style>
