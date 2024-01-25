<script lang="ts">
	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';
	import Layers from '../Layers/Layers.svelte';
	import Select from '../Select/Select.svelte';
	import Eye from '../icons/Eye.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import AnimatedPswdInput from './AnimatedPswdInput.svelte';
	import ButtonInInput from './ButtonInInput.svelte';
	import LangSelector from './LangSelector.svelte';
	import type { LanguagedInputProps } from './types';

	let { type = 'text', languaged = false, name, ...attributes } = $props<LanguagedInputProps>();
	let { mouse, ...events } = new MouseWatcher();

	let pswdVisible = $state(false);
	let pswdIconPlayhead = $derived(pswdVisible ? 0 : 1);
	let hasLeading = $derived(type === 'color');
	let hasTrailing = $derived(type === 'password' || languaged);
	let value = $state('');

	function togglePswdVisibility() {
		pswdVisible = !pswdVisible;
	}
</script>

<!-- TODO: What would the correct role be? -->
<span class="input-whole global-layer-flashlight-hover-trigger" {...events} role="presentation">
	<Layers>
		<LayerFlashlight {mouse} />
		<span class="layer-content">
			{#if type === 'color'}
				<span class="picker-wrapper">
					<input bind:value type="color" class="global-input-reset color-picker" />
				</span>
			{/if}
			<span
				class="input-wrapper"
				class:no-right-padding={hasTrailing}
				class:no-left-padding={hasLeading}
				class:textarea-wrapper={type === 'textarea'}
			>
				{#if type === 'password'}
					<AnimatedPswdInput {pswdVisible} {...attributes} />
				{:else if type === 'text' || type === 'color'}
					<input bind:value {name} type="text" class="global-input-reset global-text-body" />
				{:else if type === 'textarea'}
					<textarea bind:value {name} class="global-input-reset global-text-body" />
				{/if}
			</span>
			{#if hasTrailing}
				<span class="buttons-wrapper">
					{#if type === 'password'}
						<ButtonInInput onclick={togglePswdVisibility}>
							<IconWrapper animated playhead={pswdIconPlayhead} frames={8} frameSize={20}>
								<Eye />
							</IconWrapper>
						</ButtonInInput>
					{/if}
					{#if languaged}
						<LangSelector />
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

		/* For Layer Flashlight */
		--size-layer-flashlight-border-radius: var(--size-input-border-radius);
		--color-layer-flashlight-hover: var(--color-input-layer-flashlight-hover);
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
	.no-left-padding {
		padding-left: 0;
	}

	.layer-content {
		display: flex;
	}

	.picker-wrapper {
		display: flex;
		flex-shrink: 0;
		padding: var(--size-input-color-picker-wrapper-padding);
	}
	.buttons-wrapper {
		display: flex;
		align-items: flex-start;
		flex-shrink: 0;
		padding: var(--size-input-to-button-padding);
	}

	.textarea-wrapper {
		padding-inline-end: var(--size-input-textarea-wrapper-padding-inline-end);
	}

	textarea {
		min-height: calc(
			var(--text-body-padding-top) + var(--text-body-line-height) + var(--text-body-padding-bottom)
		);
		resize: vertical;
		padding-inline-end: var(--size-input-textarea-padding-inline-end);
	}

	.color-picker {
		width: var(--size-input-color-picker);
		height: var(--size-input-color-picker);
		border: var(--border-input-color-picker);
		border-radius: var(--size-input-color-picker-radius);
		padding: 0;
		box-shadow: var(--shadow-input-color-picker);
	}
	.color-picker::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
	}
</style>
