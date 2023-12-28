<script lang="ts">
	import LayerFX from '../LayerFX/LayerFX.svelte';
	import { MouseWatcher } from '../LayerFX/watcher.svelte';
	import Layers from '../Layers.svelte';
	import Eye from '../icons/Eye.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import AnimatedPswdInput from './AnimatedPswdInput.svelte';
	import ButtonInInput from './ButtonInInput.svelte';
	import type { LanguagedInputProps } from './types';

	let { type = 'text', languaged = false, ...attributes } = $props<LanguagedInputProps>();
	let { mousePos, onmousemove } = new MouseWatcher();

	let pswdVisible = $state(false);
	let pswdIconPlayhead = $derived(pswdVisible ? 0 : 1);
	let hasButtons = $derived(type === 'password' || languaged);
	let value = $state('');

	function togglePswdVisibility() {
		pswdVisible = !pswdVisible;
	}
</script>

<!-- TODO: What would the correct role be? -->
<span class="input-whole" {onmousemove} role="presentation">
	<Layers>
		<LayerFX {mousePos} />
		<span class="layer-content">
			<span class="input-wrapper" class:no-right-padding={hasButtons}>
				{#if type === 'password'}
					<AnimatedPswdInput {pswdVisible} {...attributes} />
				{:else if type === 'text'}
					<input bind:value type="text" class="global-input-reset global-text-body" />
				{/if}
			</span>
			{#if hasButtons}
				<span class="buttons-wrapper">
					{#if type === 'password'}
						<ButtonInInput onclick={togglePswdVisibility}>
							<IconWrapper animated playhead={pswdIconPlayhead} steps={8} frameSize={20}>
								<Eye />
							</IconWrapper>
						</ButtonInInput>
					{/if}
				</span>
			{/if}
		</span>
	</Layers>
</span>

<style>
	/* General */
	.input-whole {
		display: inline-block;
		width: var(--size-input-width);
		background-color: var(--color-input-bg);
		box-shadow: var(--shadow-input);
		border-radius: var(--size-input-border-radius);
		overflow: hidden;

		/* To fix not working overflow hidden */
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
		flex: 1;
		line-height: 0;
	}
	.no-right-padding {
		padding-right: 0;
	}

	.layer-content {
		display: flex;
	}
	.buttons-wrapper {
		display: flex;
		align-items: flex-start;
		flex-shrink: 0;
		padding: var(--size-input-to-button-padding);
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
	}
</style>
