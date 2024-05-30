<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import { tweened } from 'svelte/motion';

	import Eye from '../../icons/Eye.svelte';
	import IconWrapper from '../../icons/IconWrapper.svelte';
	import { createMouseWatcher } from '../../reactivity/mouse-watcher.svelte';
	import LayerFlashlight from '../ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '../ActiveElementFX/Layers.svelte';
	import ButtonInInput from './ButtonInInput.svelte';
	import LangSelector from './LangSelector.svelte';
	import PasswordInput from './PasswordInput.svelte';
	import TranslationsInputs from './TranslationsInputs.svelte';
	import type { InputProps } from './types';

	let {
		value = $bindable(),
		selectionStart = $bindable(0),
		selectionEnd = $bindable(0),
		currentLang = $bindable($page.params.lang as SupportedLang),
		translationsForm,
		translationsPrefix,
		style,
		...attributes
	}: InputProps = $props();

	const eyeClosedFrame = 0;
	const eyeOpenedFrame = 7;
	const pswdIconCurrentFrame = tweened(eyeOpenedFrame, {
		duration: 250
	});

	let { mouse, ...events } = createMouseWatcher();
	let pswdVisible = $state(false);

	let hasLeading = $derived(attributes.type === 'color');
	let hasTrailing = $derived(attributes.type === 'password' || translationsForm);

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

	function onselect(e: Event) {
		const target = e.target as HTMLInputElement;
		({ selectionStart, selectionEnd } = target);
	}
</script>

<!-- TODO: What would the correct role be? -->
<span class="input-and-affixes" {...events} role="presentation" {style}>
	<Layers overflow="hidden">
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
				{#if translationsForm}
					<TranslationsInputs
						{translationsPrefix}
						{translationsForm}
						{currentLang}
						{...attributes}
						{onselect}
					/>
				{:else if attributes.type === 'password'}
					<PasswordInput {pswdVisible} {...attributes} bind:value {onselect} />
				{:else if attributes.type === 'textarea'}
					<textarea
						bind:value
						{...attributes}
						class="global-reset-input global-text-body"
						{onselect}
					>
					</textarea>
				{:else}
					<input
						bind:value
						{...attributes}
						class="global-reset-input global-text-body"
						{onselect}
					/>
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
					{#if translationsForm}
						<LangSelector bind:value={currentLang} />
					{/if}
				</span>
			{/if}
		</span>
	</Layers>
</span>

<style>
	/* General */
	.input-and-affixes {
		display: inline-block;
		min-width: var(--size-input-min-width);
		max-width: var(--size-input-max-width);
		background-color: var(--color-input-bg);
		box-shadow: var(--shadow-input);
		border-radius: var(--size-input-border-radius);

		margin-top: var(--input-margin-top);
		margin-bottom: var(--input-margin-bottom);

		transition: var(--transition-input);

		/* For Layers */
		--layers-border-radius: var(--size-input-border-radius);

		/* For Layer Flashlight */
		--size-layer-flashlight-border-radius: var(--size-input-border-radius);
		--color-layer-flashlight-pointer: var(--color-input-layer-flashlight-hover);
	}
	.input-and-affixes:last-child {
		margin-bottom: var(--input-last-child-margin-bottom);
	}
	.input-and-affixes:has(input[aria-invalid='true']) {
		background-color: var(--color-input-invalid-bg);
		animation: error 300ms var(--smooth-ease-out);
	}

	/* We use global to stylize possible textare inside TranslationsInputs */
	.input-and-affixes :global {
		textarea {
			min-height: calc(
				var(--text-body-padding-top) + var(--text-body-line-height) * 2 +
					var(--text-body-padding-bottom)
			);
			min-width: calc(var(--size-cell-width) - var(--size-3xl));
			max-height: calc(
				var(--text-body-padding-top) + var(--text-body-line-height) * 10 +
					var(--text-body-padding-bottom)
			);
			resize: vertical;
			padding-inline-end: var(--size-input-textarea-padding-inline-end);
			overflow-y: scroll;
		}
		textarea::placeholder {
			color: var(--color-input-placeholder);
		}
		textarea::-webkit-resizer {
			display: none;
		}
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

	input::placeholder {
		color: var(--color-input-placeholder);
	}

	@keyframes error {
		0% {
			transform: translateX(-10px);
		}
		25% {
			transform: translateX(7px);
		}
		50% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(3px);
		}
		100% {
			transform: translateX(0);
		}
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
	}
</style>
