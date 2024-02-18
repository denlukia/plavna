<script lang="ts">
	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';
	import Layers from '../Layers/Layers.svelte';
	import Eye from '../(icons)/Eye.svelte';
	import IconWrapper from '../(icons)/IconWrapper.svelte';
	import AnimatedPswdInput from './PasswordInput.svelte';
	import ButtonInInput from './ButtonInInput.svelte';
	import LangSelector from './LangSelector.svelte';
	import type { LanguagedInputProps } from './types';
	import { tweened } from 'svelte/motion';

	let { value, ...attributes } = $props<LanguagedInputProps>();

	const eyeClosedFrame = 0;
	const eyeOpenedFrame = 7;
	const pswdIconCurrentFrame = tweened(eyeOpenedFrame, {
		duration: 250
	});

	let { mouse, ...events } = new MouseWatcher();
	let pswdVisible = $state(false);

	let hasLeading = $derived(attributes.type === 'color');
	let hasTrailing = $derived(attributes.type === 'password' || attributes.languaged);

	function togglePswdVisibility() {
		pswdVisible = !pswdVisible;
	}

	$effect(() => {
		if (pswdVisible) {
			pswdIconCurrentFrame.set(eyeClosedFrame);
		} else {
			pswdIconCurrentFrame.set(eyeOpenedFrame);
		}
	});
</script>

<!-- TODO: What would the correct role be? -->
<span class="input global-layer-flashlight-hover-trigger" {...events} role="presentation">
	<Layers>
		<LayerFlashlight {mouse} />
		<span class="layer-content">
			{#if attributes.type === 'color'}
				<span class="picker-wrapper">
					<input bind:value type="color" class="global-reset-input color-picker" />
				</span>
			{/if}
			<span
				class="input-wrapper global-fix-overflow"
				class:no-right-padding={hasTrailing}
				class:no-left-padding={hasLeading}
				class:textarea-wrapper={attributes.type === 'textarea'}
			>
				{#if attributes.type === 'password'}
					<AnimatedPswdInput {pswdVisible} {...attributes} />
				{:else if attributes.type === 'text' || !attributes.type}
					<input
						bind:value
						{...attributes}
						type="text"
						class="global-reset-input global-text-body"
					/>
				{:else if attributes.type === 'textarea'}
					<textarea bind:value {...attributes} class="global-reset-input global-text-body" />
				{/if}
			</span>
			{#if hasTrailing}
				<span class="buttons-wrapper">
					{#if attributes.type === 'password'}
						<ButtonInInput onclick={togglePswdVisibility}>
							<IconWrapper currentFrame={$pswdIconCurrentFrame} frames={8} frameSize={20}>
								<Eye />
							</IconWrapper>
						</ButtonInInput>
					{/if}
					{#if attributes.languaged}
						<LangSelector />
					{/if}
				</span>
			{/if}
		</span>
	</Layers>
</span>

<style>
	/* General */
	.input {
		display: inline-block;
		width: var(--size-input-width);
		background-color: var(--color-input-bg);
		box-shadow: var(--shadow-input);
		border-radius: var(--size-input-border-radius);
		overflow: hidden;

		margin-top: var(--input-margin-top);
		margin-bottom: var(--input-margin-bottom);

		/* For Layer Flashlight */
		--size-layer-flashlight-border-radius: var(--size-input-border-radius);
		--color-layer-flashlight-pointer: var(--color-input-layer-flashlight-hover);
	}
	.input:last-child {
		margin-bottom: var(--input-last-child-margin-bottom);
	}

	.input-wrapper {
		padding-inline: var(--size-input-padding-inline);
		padding-top: var(--size-input-padding-top);
		padding-bottom: var(--size-input-padding-bottom);
		flex: 1;
		line-height: 0;
		transform: translate(0, 0);
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

	input::placeholder,
	textarea::placeholder {
		color: var(--color-input-placeholder-text);
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
	}
</style>
