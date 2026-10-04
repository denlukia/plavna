<script lang="ts">
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import type { Snippet } from 'svelte';

	import RippleMask from './RippleMask.svelte';

	type Props = {
		children: Snippet;
		inArticle?: boolean;
		visible?: boolean;
	};

	let { children, inArticle = false, visible = true }: Props = $props();

	let element: HTMLElement | null = $state(null);
	let content: HTMLElement | null = $state(null);
	let origin: { x: number; y: number } | null = $state(null);

	// The wrapper itself is pointer-events: none, so it never receives pointer
	// events directly. Track the live pointer on the parent (the hovered
	// preview) instead and translate it into wrapper-local coordinates.
	// The ripple snapshots this position when its animation starts.
	$effect(() => {
		const target = element;
		if (!target) return;
		const parent = target.parentElement;
		if (!parent) return;
		const handler = (event: PointerEvent) => {
			const rect = target.getBoundingClientRect();
			origin = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		};
		parent.addEventListener('pointerenter', handler);
		parent.addEventListener('pointermove', handler);
		return () => {
			parent.removeEventListener('pointerenter', handler);
			parent.removeEventListener('pointermove', handler);
		};
	});

	// Live pointer position; the ripple snapshots it when its animation starts
	// (the wrapper itself is pointer-events: none).
</script>

<span
	class="image-wrapper"
	class:in-article={inArticle}
	class:visible
	bind:this={element}
	style="--artistic-overflow: {ARTISTIC_OVERFLOW}px"
>
	<span class="image-content" bind:this={content}>
		{@render children()}
	</span>
	<RippleMask target={content} active={!visible} {origin} />
</span>

<style>
	.image-wrapper {
		--in-min-raw: 1025;
		--in-max-raw: 1332;
		--out-min-raw: 4;
		--out-max-raw: 0;

		--in-min: 1025px;
		--in-max: 1332px;
		--out-min: 4px;
		--out-max: 0px;

		--x: 100vw;

		--inset: clamp(
			calc(
				calc((var(--x) - var(--in-min)) / calc(var(--in-max-raw) - var(--in-min-raw))) *
					calc(var(--out-max-raw) - var(--out-min-raw)) + var(--out-min)
			),
			var(--out-max),
			var(--out-min)
		);

		display: block;
		position: absolute;
		/* Above the revealed layer underneath: the mask hole gates what shows
		through, so the final component only ever appears inside the ripple. */
		z-index: 1;

		margin-left: var(--inset);
		margin-top: var(--inset);

		width: calc(100% - var(--inset) * 2);
		height: calc(100% - var(--inset) * 2);
		overflow: hidden;

		pointer-events: none;
	}

	.image-content {
		display: block;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	@media (max-width: 1024px) {
		.image-wrapper {
			--in-min-raw: 320;
			--in-max-raw: 796;
			--out-min-raw: 10;
			--out-max-raw: 0;

			--in-min: 320px;
			--in-max: 796px;
			--out-min: 10px;
			--out-max: 0px;
		}
		.image-wrapper.in-article {
			--out-min-raw: 12;
			--out-max-raw: 7;
			--out-min: 12px;
			--out-max: 7px;
		}
	}
</style>
