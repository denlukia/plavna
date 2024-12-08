<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	import { rotateandscale } from '../../transitions/rotateandscale';
	import Tail from './Tail.svelte';
	import type { PopupKind } from './types';

	type Props = {
		children: Snippet;
		kind: PopupKind;
	};

	const animationDuration = 300;

	let { children, kind = 'form' }: Props = $props();
</script>

<div
	class="box-wrapper"
	transition:fade|global={{
		duration: animationDuration,
		easing: cubicOut
	}}
>
	<div class="tail-wrapper">
		<Tail />
	</div>
	<div
		class="box kind-{kind}"
		transition:rotateandscale|global={{
			duration: animationDuration,
			easing: cubicOut,
			scaleX: 0.1,
			scaleY: 0.1,
			opacity: 1
		}}
	>
		{@render children()}
	</div>
</div>

<style>
	.box-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 2px;
		transform-origin: top center;
	}
	.box {
		min-width: 150px;
		display: flex;
		flex-direction: column;
		background: var(--color-box-bg);
		border-radius: var(--size-box-border-radius);
		box-shadow: var(--shadow-box);
		padding-top: var(--size-box-padding-top);
		padding-bottom: var(--size-box-padding-bottom);
		padding-inline: var(--size-box-padding-inline);
		transform-origin: top center;
	}
	.tail-wrapper {
		color: var(--color-box-bg);
		width: 60px;
		z-index: 1;
		margin-bottom: -0.5px;
		transform-origin: bottom center;
	}
	.kind-list {
		gap: var(--size-box-gap);
	}
	.kind-form {
		align-items: stretch;
		padding-top: var(--size-box-form-padding-top);
	}
	/* We use global cause we'd like Tail component to be raw SVG code from Figma */
	.tail-wrapper > :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
