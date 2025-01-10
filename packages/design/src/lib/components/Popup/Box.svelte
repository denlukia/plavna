<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	import { boxflip } from './boxflip';
	import Tail from './Tail.svelte';
	import type { PopupKind, TailPosition } from './types';

	type Props = {
		children: Snippet;
		kind: PopupKind;
		tailPosition: TailPosition;
	};

	const animationDuration = 300;

	let { children, kind = 'form', tailPosition }: Props = $props();
</script>

<div
	class="box-wrapper"
	transition:fade|global={{
		duration: animationDuration,
		easing: cubicOut
	}}
>
	<div class="tail-wrapper horizontal-{tailPosition.x} vertical-{tailPosition.y}">
		<Tail />
	</div>
	<div
		class="box kind-{kind} origin-horizontal-{tailPosition.x} origin-vertical-{tailPosition.y}"
		transition:boxflip|global={{
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

		--size-tail-half-width: 25px;
	}
	.origin-horizontal-left.origin-vertical-top {
		transform-origin: calc(0% + var(--size-tail-half-width)) 0%;
	}
	.origin-horizontal-left.origin-vertical-bottom {
		transform-origin: calc(0% + var(--size-tail-half-width)) 100%;
	}
	.origin-horizontal-right.origin-vertical-top {
		transform-origin: calc(100% - var(--size-tail-half-width)) 0%;
	}
	.origin-horizontal-right.origin-vertical-bottom {
		transform-origin: calc(100% - var(--size-tail-half-width)) 100%;
	}
	.origin-horizontal-center.origin-vertical-top {
		transform-origin: 50% 0%;
	}
	.origin-horizontal-center.origin-vertical-bottom {
		transform-origin: 50% 100%;
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
		width: calc(var(--size-tail-half-width) * 2);
		z-index: 1;
		margin-bottom: -0.5px;
		transform-origin: bottom center;
		margin-inline: calc(var(--size-tail-half-width) / 1.5);
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

	.horizontal-left {
		align-self: flex-start;
	}
	.horizontal-right {
		align-self: flex-end;
	}
	.vertical-bottom {
		order: 1;
	}
</style>
