<script lang="ts">
	import Strong from '$lib/features/markdown/renderers/Strong.svelte';

	import { createPressWatcher } from '../../reactivity/press-watcher.svelte';
	import ActiveElementFX from '../ActiveElementFX/ActiveElementFX.svelte';
	import Typography from '../Typography/Typography.svelte';
	import type { ButtonProps } from './types';

	let {
		children,
		kind = 'primary',
		size: sizeProp = 'body',
		href,
		dataSvelteKitPreloadData,
		dataSvelteKitReload,
		onclick,
		active,
		imitatePressingOnClick = true,
		placement = 'default',
		ref = $bindable(null),
		leadingIcon,
		trailingIcon,
		...attrs
	}: ButtonProps = $props();

	const { pressed, onclick: onclickWatcher, ...events } = $derived(createPressWatcher());

	let size = $derived(placement === 'default' ? sizeProp : 'small');

	function onclickWrapper(event: Parameters<NonNullable<ButtonProps['onclick']>>[0]) {
		imitatePressingOnClick && onclickWatcher();

		// @ts-expect-error TODO: Improve typing
		if (onclick) onclick(event);
	}
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	bind:this={ref}
	role={href ? 'link' : 'button'}
	data-sveltekit-preload-data={dataSvelteKitPreloadData}
	data-sveltekit-reload={dataSvelteKitReload}
	class={`button kind-${kind} size-${size} placement-${placement}
		global-reset-line-height ${href ? 'global-link-rest' : 'global-button-rest'}`}
	class:pressed={active || pressed}
	onclick={onclickWrapper}
	{...events}
	{...attrs}
	{href}
>
	<ActiveElementFX>
		<span class="content">
			{#if leadingIcon}
				{@render leadingIcon()}
			{/if}
			{#if children}
				<Typography size={`${size}-short`}>
					<Strong>
						{@render children()}
					</Strong>
				</Typography>
			{/if}
			{#if trailingIcon}
				{@render trailingIcon()}
			{/if}
		</span>
	</ActiveElementFX>
</svelte:element>

<style>
	/* General */
	.button {
		padding: 0;
		transition: var(--transition-button);
		display: inline-block;
	}

	.content {
		display: inline-block;
	}

	.button:not(.pressed):hover {
		transform: var(--transform-button-hover);
	}

	.button:active,
	.button.pressed {
		transform: var(--transform-button-active);
	}

	/* Type Dependent */
	.kind-primary {
		background: var(--color-button-primary-bg);
		color: var(--color-button-primary-text);
		box-shadow: var(--shadow-button-primary);
		border: var(--border-button-primary);
		--color-layer-flashlight-pointer: var(--color-button-primary-layer-flashlight-hover);
	}
	.kind-secondary {
		background: var(--color-button-secondary-bg);
		color: var(--color-button-secondary-text);
		box-shadow: var(--shadow-button-secondary);
		border: var(--border-button-secondary);
		--color-layer-flashlight-pointer: var(--color-button-secondary-layer-flashlight-hover);
	}
	.kind-prominent {
		background: var(--color-button-prominent-bg);
		color: var(--color-button-prominent-text);
		box-shadow: var(--shadow-button-prominent);
		border: var(--border-button-prominent);
		--color-layer-flashlight-pointer: var(--color-button-prominent-layer-flashlight-hover);
	}
	.kind-destructive {
		background: var(--color-button-destructive-bg);
		color: var(--color-button-destructive-text);
		box-shadow: var(--shadow-button-destructive);
		border: var(--border-button-destructive);
		--color-layer-flashlight-pointer: var(--color-button-destructive-layer-flashlight-hover);
	}
	.kind-primary:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-primary);
	}
	.kind-secondary:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-secondary);
	}
	.kind-prominent:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-prominent);
	}
	.type-destructive:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-destructive);
	}
	.kind-primary:active,
	.kind-primary.pressed {
		box-shadow: var(--shadow-button-active-primary);
	}
	.kind-secondary:active,
	.kind-secondary.pressed {
		box-shadow: var(--shadow-button-active-secondary);
	}
	.kind-prominent:active,
	.kind-prominent.pressed {
		box-shadow: var(--shadow-button-active-prominent);
	}
	.kind-destructive:active,
	.kind-destructive.pressed {
		box-shadow: var(--shadow-button-active-destructive);
	}

	/* Size Dependent */
	.size-body {
		border-radius: var(--size-button-body-border-radius);
		--layers-border-radius: var(--size-button-body-border-radius);
	}
	.size-body .content {
		padding-inline: var(--size-button-body-padding-inline);
		padding-top: var(--size-button-body-padding-top);
		padding-bottom: var(--size-button-body-padding-bottom);
	}
	.size-small {
		border-radius: var(--size-button-small-border-radius);
		--layers-border-radius: var(--size-button-small-border-radius);
	}

	.size-small .content {
		padding-inline: var(--size-button-small-padding-inline);
		padding-top: var(--size-button-small-padding-top);
		padding-bottom: var(--size-button-small-padding-bottom);
	}

	/* For Button in Input */
	.placement-in-input {
		border-radius: var(--size-button-in-input-border-radius);
		background-color: var(--color-button-in-input-bg);
		box-shadow: var(--shadow-button-in-input);
		height: var(--size-button-in-input-height);
		transition: var(--transition-button-in-input);

		--color-layer-flashlight-pointer: var(--color-button-in-input-layer-flashlight-hover);
		--layers-border-radius: var(--size-button-in-input-border-radius);
	}
	.placement-in-input .content {
		padding-inline: var(--size-button-in-input-padding-inline);
		padding-top: var(--size-button-in-input-padding-top);
		padding-bottom: var(--size-button-in-input-padding-bottom);
	}
	.placement-in-input:hover {
		transform: var(--transform-button-in-input-hover);
		box-shadow: var(--shadow-button-in-input-hover);
	}
	.placement-in-input:active {
		transform: var(--transform-button-in-input-active);
		box-shadow: var(--shadow-button-in-input-active);
	}

	/* For Button in Tag */
	.placement-in-tag {
		border-radius: var(--size-button-in-tag-border-radius);
		background-color: var(--color-button-in-tag-bg);
		box-shadow: var(--shadow-button-in-tag);
		height: var(--size-button-in-tag-height);
		transition: var(--transition-button-in-tag);

		--color-layer-flashlight-pointer: var(--color-button-in-tag-layer-flashlight-hover);
		--layers-border-radius: var(--size-button-in-tag-border-radius);
	}
	.placement-in-tag .content {
		padding-inline: var(--size-button-in-tag-padding-inline);
		padding-top: var(--size-button-in-tag-padding-top);
		padding-bottom: var(--size-button-in-tag-padding-bottom);
	}
	.placement-in-tag:hover {
		transform: var(--transform-button-in-tag-hover);
		box-shadow: var(--shadow-button-in-tag-hover);
	}
	.placement-in-tag:active {
		transform: var(--transform-button-in-tag-active);
		box-shadow: var(--shadow-button-in-tag-active);
	}
</style>
