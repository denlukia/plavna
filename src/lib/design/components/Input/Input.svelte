<script lang="ts">
	import { expoOut } from 'svelte/easing';
	import { fly, getFlyConf } from '$lib/design/transitions/fly';

	import { createMouseWatcher } from '../../reactivity/mouse-watcher.svelte';
	import LayerFlashlight from '../ActiveElementFX/LayerFlashlight.svelte';
	import Layers from '../ActiveElementFX/Layers.svelte';
	import type { InputOrTextareaProps } from './types';

	let {
		value = $bindable(),
		selectionStart = $bindable(0),
		selectionEnd = $bindable(0),
		style,
		leading,
		trailing,
		animateOnTypeChange,
		animateOnValueChange,
		...attributes
	}: InputOrTextareaProps = $props();

	let { mouse, ...mouseWatcherEvents } = createMouseWatcher();

	let inputwrapperRef: HTMLSpanElement | null = $state(null);

	// We want to change the key (and thus trigger transitions)
	// only when animateOnTypeChange or animateOnValueChange are true
	// they are supposed to be set to true only for short moments, and immediately back to false
	// for example when we change a value but it's a result of lang change
	// so we don't have an animation for every value change
	let key = $derived.by(() => {
		if (animateOnTypeChange) {
			return String('type' in attributes ? attributes.type : 'text');
		}
		if (animateOnValueChange) {
			return String(value);
		}
		return String(Math.random());
	});

	function onselectionchange(e: Event) {
		const target = e.target as Document;
		const activeElement = target.activeElement;

		if (
			activeElement instanceof HTMLInputElement ||
			(activeElement instanceof HTMLTextAreaElement && inputwrapperRef?.contains(activeElement))
		) {
			({ selectionStart, selectionEnd } = activeElement);
		}
	}
</script>

<svelte:document {onselectionchange} />

<!-- TODO: What would the correct role be? -->
<span class="input-and-affixes" {...mouseWatcherEvents} role="presentation" {style}>
	<Layers overflow="hidden">
		<LayerFlashlight {mouse} />
		<span class="layer-content">
			<!-- 1. Leading -->
			{#if leading}
				<span class="buttons-wrapper">
					{@render leading()}
				</span>
			{/if}

			<!-- 2. Input -->
			<span
				class="input-wrapper global-fix-overflow"
				class:no-trailing-padding={trailing}
				class:no-leading-padding={leading}
				class:textarea-wrapper={attributes.textarea}
				bind:this={inputwrapperRef}
			>
				<Layers>
					<!-- ISSUE: DRY-ing this into svelte:element seems to break #key -->
					{#if attributes.textarea}
						{#key key}
							<textarea
								in:fly={getFlyConf(expoOut, 'bottom')}
								out:fly={getFlyConf(expoOut, 'top')}
								class="global-reset-input global-text-body"
								{value}
								{...attributes}
							></textarea>
						{/key}
					{:else}
						{#key key}
							<input
								in:fly={getFlyConf(expoOut, 'bottom')}
								out:fly={getFlyConf(expoOut, 'top')}
								class="global-reset-input global-text-body"
								{value}
								{...attributes}
							/>
						{/key}
					{/if}
				</Layers>
			</span>

			<!-- 3. Trailing -->
			{#if trailing}
				<span class="buttons-wrapper">
					{@render trailing()}
				</span>
			{/if}
		</span>
	</Layers>
</span>

<style>
	/* General */
	.input-and-affixes {
		display: inline-block;
		width: 100%;
		background-color: var(--color-input-bg);
		box-shadow: var(--shadow-input);
		border-radius: var(--size-input-border-radius);

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
	.no-trailing-padding {
		padding-inline-end: 0;
	}
	.no-leading-padding {
		padding-inline-start: 0;
	}

	.layer-content {
		display: flex;
	}

	.buttons-wrapper {
		display: flex;
		align-items: flex-start;
		flex-shrink: 0;
		padding: var(--size-input-to-button-padding);
		gap: var(--size-input-buttons-gap);
	}

	.textarea-wrapper {
		padding-inline-end: var(--size-input-textarea-wrapper-padding-inline-end);
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
