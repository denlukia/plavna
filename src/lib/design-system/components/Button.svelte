<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import Layers from './Layers.svelte';
	import LayerFX from './LayerFX/LayerFX.svelte';
	import Text from './Text.svelte';
	import { MouseWatcher } from './LayerFX/watcher.svelte';

	type Props = {
		children: Snippet;
		type?: 'primary' | 'secondary' | 'prominent' | 'destructive';
		size?: 'body' | 'small';
		bold?: boolean;
		href?: string;
		onclick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
	};
	let {
		children,
		type = 'primary',
		size = 'body',
		bold = false,
		href,
		onclick = () => {}
	} = $props<Props>();

	let { mousePos, onmousemove } = new MouseWatcher();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	role={href ? 'link' : 'button'}
	class={`reset button type-${type} size-${size} ${
		href ? 'global-link-rest' : 'global-button-rest'
	}`}
	{onmousemove}
	{onclick}
	{href}
>
	<Layers>
		<LayerFX {mousePos} />
		<span class="layer-content">
			<Text size={`${size}-short`} {bold}>{@render children()}</Text>
		</span>
	</Layers>
</svelte:element>

<style>
	/* General */
	.button {
		padding: 0;
		transition: var(--transition-button);
		overflow: hidden;

		/* For LayerFX */
		--transition-layer-fx-hover: var(--transition-button-layer-fx-hover);
		--size-layer-fx-hover: var(--size-button-layer-fx-hover);
	}

	.button:hover {
		transform: var(--transform-button-hover);
	}
	.button:hover :global(.layers > .layer-fx) {
		opacity: 1;
	}
	.button:active {
		transform: var(--transform-button-active);
	}

	/* Type Dependent */
	.type-primary {
		background: var(--color-button-primary-bg);
		color: var(--color-button-primary-text);
		box-shadow: var(--shadow-button-primary);
		border: var(--border-button-primary);
		--color-layer-fx-hover: var(--color-button-primary-layer-fx-hover);
	}
	.type-secondary {
		background: var(--color-button-secondary-bg);
		color: var(--color-button-secondary-text);
		box-shadow: var(--shadow-button-secondary);
		border: var(--border-button-secondary);
		--color-layer-fx-hover: var(--color-button-secondary-layer-fx-hover);
	}
	.type-prominent {
		background: var(--color-button-prominent-bg);
		color: var(--color-button-prominent-text);
		box-shadow: var(--shadow-button-prominent);
		border: var(--border-button-prominent);
		--color-layer-fx-hover: var(--color-button-prominent-layer-fx-hover);
	}
	.type-destructive {
		background: var(--color-button-destructive-bg);
		color: var(--color-button-destructive-text);
		box-shadow: var(--shadow-button-destructive);
		border: var(--border-button-destructive);
		--color-layer-fx-hover: var(--color-button-destructive-layer-fx-hover);
	}
	.type-primary:hover {
		box-shadow: var(--shadow-button-hover-primary);
	}
	.type-secondary:hover {
		box-shadow: var(--shadow-button-hover-secondary);
	}
	.type-prominent:hover {
		box-shadow: var(--shadow-button-hover-prominent);
	}
	.type-destructive:hover {
		box-shadow: var(--shadow-button-hover-destructive);
	}
	.type-primary:active {
		box-shadow: var(--shadow-button-active-primary);
	}
	.type-secondary:active {
		box-shadow: var(--shadow-button-active-secondary);
	}
	.type-prominent:active {
		box-shadow: var(--shadow-button-active-prominent);
	}
	.type-destructive:active {
		box-shadow: var(--shadow-button-active-destructive);
	}

	/* Size Dependent */
	.size-body {
		border-radius: var(--size-button-body-border-radius);
	}
	.size-body .layer-content {
		padding-inline: var(--size-button-body-padding-inline);
		padding-top: var(--size-button-body-padding-top);
		padding-bottom: var(--size-button-body-padding-bottom);
	}
	.size-small {
		border-radius: var(--size-button-small-border-radius);
	}
	.size-small .layer-content {
		padding-inline: var(--size-button-small-padding-inline);
		padding-top: var(--size-button-small-padding-top);
		padding-bottom: var(--size-button-small-padding-bottom);
	}
</style>
