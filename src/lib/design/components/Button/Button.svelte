<script lang="ts">
	import { type Snippet } from 'svelte';
	import type {
		HTMLAnchorAttributes,
		HTMLButtonAttributes,
		MouseEventHandler
	} from 'svelte/elements';
	import Strong from '$lib/features/markdown/renderers/Strong.svelte';

	import { createPressWatcher } from '../../reactivity/press-watcher.svelte';
	import ActiveElementFX from '../ActiveElementFX/ActiveElementFX.svelte';
	import Typography from '../Typography/Typography.svelte';

	// type UniversalMouseEventHandler = MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
	type AnchorAttrs = HTMLAnchorAttributes & {
		href: string;
	};
	type ButtonAttrs = HTMLButtonAttributes & {
		href?: never;
	};

	type Props = (AnchorAttrs | ButtonAttrs) & {
		children: Snippet;
		kind?: 'primary' | 'secondary' | 'prominent' | 'destructive';
		size?: 'body' | 'small';
		dataSvelteKitPreloadData?: HTMLAnchorAttributes['data-sveltekit-preload-data'];
		dataSvelteKitReload?: HTMLAnchorAttributes['data-sveltekit-reload'];
		href?: string;
		active?: boolean;
		imitatePressingOnClick?: boolean;
		formaction?: string;
	};
	let {
		children,
		kind = 'primary',
		size = 'body',
		href,
		dataSvelteKitPreloadData,
		dataSvelteKitReload,
		onclick,
		active = false,
		imitatePressingOnClick = true,
		...attrs
	}: Props = $props();

	const { pressed, onclick: onclickWatcher, ...events } = $derived(createPressWatcher());

	function onclickWrapper(event: Parameters<NonNullable<Props['onclick']>>[0]) {
		imitatePressingOnClick && onclickWatcher();

		// @ts-expect-error TODO: Improve typing
		if (onclick) onclick(event);
	}
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? 'link' : 'button'}
	data-sveltekit-preload-data={dataSvelteKitPreloadData}
	data-sveltekit-reload={dataSvelteKitReload}
	class={`button kind-${kind} size-${size} 
	 global-reset-line-height
	${href ? 'global-link-rest' : 'global-button-rest'}`}
	class:pressed={active || pressed}
	onclick={onclickWrapper}
	{...events}
	{...attrs}
	{href}
>
	<ActiveElementFX>
		<span class="content">
			<Typography size={`${size}-short`}><Strong>{@render children()}</Strong></Typography>
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
</style>
