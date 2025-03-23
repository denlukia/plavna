<script lang="ts">
	import type { ImagePathAndMeta } from '@plavna/common';
	import { onMount } from 'svelte';

	type Props = {
		pathAndMeta: ImagePathAndMeta;
		style?: string;
		bgInset?: string;
		zoomOut?: boolean;
		transitionDuration?: number;
		objectFit?: 'cover' | 'contain';
	};

	const initialOpacity = '0.01';

	let {
		pathAndMeta,
		bgInset: bgInset = '0',
		style = '',
		zoomOut = true,
		transitionDuration = 1000,
		objectFit = 'cover'
	}: Props = $props();
	let imgElement: HTMLImageElement | null = $state(null);

	let mode: 'keyframes' | 'transition' = $state('keyframes');
	let revealed = $state(false);
	let scheduledReveal: ReturnType<typeof setTimeout> | null = $state(null);
	let aspectRatio = $derived(
		typeof pathAndMeta.width === 'number' && typeof pathAndMeta.height === 'number'
			? pathAndMeta.width / pathAndMeta.height
			: null
	);

	function switchToTransition() {
		mode = 'transition';
	}

	function onload() {
		switchToTransition();
		scheduleReveal();
	}

	function scheduleReveal() {
		if (scheduledReveal) {
			return;
		}

		scheduledReveal = setTimeout(() => {
			revealed = true;
		}, 200);
	}

	onMount(() => {
		if (!imgElement) return;

		const currentOpacity = getComputedStyle(imgElement).opacity;

		if (currentOpacity === initialOpacity) {
			// Keyframes didn't play yet

			switchToTransition();
			if (imgElement.complete) {
				// To have at least a ms of initial state presence for transition to play

				scheduleReveal();
			}
		} else {
			// Keyframes started playing
			// We wait for them to finish and switch to already played transition
			imgElement.addEventListener(
				'animationend',
				() => {
					revealed = true;
					switchToTransition();
				},
				{ once: true }
			);
		}
	});
</script>

<div class="positioner" {style}>
	<div
		class="bg-wrapper"
		class:revealed
		style="--bg-inset: {bgInset}; --duration: {transitionDuration}ms;"
	>
		<div
			class="bg"
			style="--background: {pathAndMeta.background}; 
					   --aspect-ratio: {aspectRatio}; 
						 --width: {(aspectRatio !== null && aspectRatio > 1) || objectFit === 'cover' ? '100%' : 'unset'};
						 --height: {(aspectRatio !== null && aspectRatio < 1) || objectFit === 'cover' ? '100%' : 'unset'}"
		></div>
	</div>

	<div class="image-wrapper">
		<img
			style="--initial-opacity: {initialOpacity}; initial-scale: {zoomOut
				? 1.05
				: 1}; --duration: {transitionDuration}ms; --object-fit: {objectFit}"
			bind:this={imgElement}
			class="image {mode}"
			class:revealed
			width={pathAndMeta.width}
			height={pathAndMeta.height}
			src={pathAndMeta.src}
			alt={pathAndMeta.alt}
			{onload}
		/>
	</div>
</div>

<style>
	.positioner {
		position: relative;
	}

	.image-wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.bg-wrapper {
		position: absolute;
		inset: var(--bg-inset);
		transition: opacity var(--duration) calc(var(--duration) / 2);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bg {
		aspect-ratio: var(--aspect-ratio);
		width: var(--width);
		height: var(--height);
		background: var(--background);
	}

	.bg-wrapper.revealed {
		opacity: 0;
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: var(--object-fit);

		--initial-blur: 15px;

		--easing: cubic-bezier(0.215, 0.61, 0.355, 1);

		--final-opacity: 1;
		--final-scale: 1;
		--final-blur: 0;
	}

	.keyframes {
		opacity: var(--initial-opacity);
		transform: scale(var(--initial-scale));
		filter: blur(var(--initial-blur));

		animation: scale-in var(--duration) 3s forwards var(--easing);
	}

	.transition {
		opacity: var(--initial-opacity);
		transform: scale(var(--initial-scale));
		filter: blur(var(--initial-blur));

		transition: all var(--duration) var(--easing);
	}

	.transition.revealed {
		opacity: 1;
		transform: scale(1);
		filter: blur(0);
	}

	@keyframes scale-in {
		0% {
			opacity: var(--initial-opacity);
			transform: scale(var(--initial-scale));
			filter: blur(var(--initial-blur));
		}
		100% {
			opacity: var(--final-opacity);
			transform: scale(var(--final-scale));
			filter: blur(var(--final-blur));
		}
	}
</style>
