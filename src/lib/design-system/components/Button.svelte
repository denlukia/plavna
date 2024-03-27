<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, MouseEventHandler } from 'svelte/elements';

	import LayerFlashlight from './Layers/LayerFlashlight.svelte';
	import Layers from './Layers/Layers.svelte';
	import LayerShift from './Layers/LayerShift.svelte';
	import { MouseWatcher } from './Layers/watcher.svelte';
	import Typography from './Typography.svelte';

	type UniversalMouseEventHandler = MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;

	type Props = {
		children: Snippet;
		type?: 'primary' | 'secondary' | 'prominent' | 'destructive';
		size?: 'body' | 'small';
		dataSvelteKitPreloadData?: HTMLAnchorAttributes['data-sveltekit-preload-data'];
		dataSvelteKitReload?: HTMLAnchorAttributes['data-sveltekit-reload'];
		href?: string;
		onclick?: UniversalMouseEventHandler;
	};
	let {
		children,
		type = 'primary',
		size = 'body',
		href,
		dataSvelteKitReload,
		onclick: onClickProp = () => {}
	} = $props<Props>();

	let pressed = $state(false);
	let pressedResetTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	$effect(() => {
		untrack(() => pressedResetTimeout && clearTimeout(pressedResetTimeout));
		if (pressed) {
			pressedResetTimeout = setTimeout(() => {
				pressed = false;
			}, 200);
		}
	});

	const onclick: UniversalMouseEventHandler = (e) => {
		pressed = true;
		onClickProp(e);
	};

	let { mouse, ...events } = new MouseWatcher();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? 'link' : 'button'}
	data-sveltekit-reload={dataSvelteKitReload}
	class={`button type-${type} size-${size} 
	global-layer-flashlight-hover-trigger global-reset-line-height
	${href ? 'global-link-rest' : 'global-button-rest'}`}
	class:pressed
	{...events}
	{onclick}
	{href}
>
	<Layers>
		<LayerFlashlight {mouse} />
		<LayerShift {mouse}>
			<span class="content">
				<Typography size={`${size}-short`} bold={true}>{@render children()}</Typography>
			</span>
		</LayerShift>
	</Layers>
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
	.type-primary {
		background: var(--color-button-primary-bg);
		color: var(--color-button-primary-text);
		box-shadow: var(--shadow-button-primary);
		border: var(--border-button-primary);
		--color-layer-flashlight-pointer: var(--color-button-primary-layer-flashlight-hover);
	}
	.type-secondary {
		background: var(--color-button-secondary-bg);
		color: var(--color-button-secondary-text);
		box-shadow: var(--shadow-button-secondary);
		border: var(--border-button-secondary);
		--color-layer-flashlight-pointer: var(--color-button-secondary-layer-flashlight-hover);
	}
	.type-prominent {
		background: var(--color-button-prominent-bg);
		color: var(--color-button-prominent-text);
		box-shadow: var(--shadow-button-prominent);
		border: var(--border-button-prominent);
		--color-layer-flashlight-pointer: var(--color-button-prominent-layer-flashlight-hover);
	}
	.type-destructive {
		background: var(--color-button-destructive-bg);
		color: var(--color-button-destructive-text);
		box-shadow: var(--shadow-button-destructive);
		border: var(--border-button-destructive);
		--color-layer-flashlight-pointer: var(--color-button-destructive-layer-flashlight-hover);
	}
	.type-primary:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-primary);
	}
	.type-secondary:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-secondary);
	}
	.type-prominent:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-prominent);
	}
	.type-destructive:not(.pressed):hover {
		box-shadow: var(--shadow-button-hover-destructive);
	}
	.type-primary:active,
	.type-primary.pressed {
		box-shadow: var(--shadow-button-active-primary);
	}
	.type-secondary:active,
	.type-secondary.pressed {
		box-shadow: var(--shadow-button-active-secondary);
	}
	.type-prominent:active,
	.type-prominent.pressed {
		box-shadow: var(--shadow-button-active-prominent);
	}
	.type-destructive:active,
	.type-destructive.pressed {
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
