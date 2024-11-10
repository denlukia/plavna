<script lang="ts">
	import { onMount } from 'svelte';

	import type { ImagePathAndMeta } from '../../types';
	import Layers from '../ActiveElementFX/Layers.svelte';

	type Props = {
		pathAndMeta: ImagePathAndMeta;
		style?: string;
	};

	const initialOpacity = '0.01';
	const duration = 1000;

	let { pathAndMeta, style = '' }: Props = $props();
	let imgElement: HTMLImageElement | null = $state(null);

	let mode: 'keyframes' | 'transition' = $state('keyframes');
	let revealed = $state(false);
	let scheduledReveal: ReturnType<typeof setTimeout> | null = $state(null);

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

<Layers stretch>
	<span class="bg" style="background: {pathAndMeta.background};"></span>
	<span class="image-wrapper">
		<img
			style="--initial-opacity: {initialOpacity}; --duration: {duration}ms; {style}"
			bind:this={imgElement}
			class="image {mode}"
			class:revealed
			width={pathAndMeta.width}
			height={pathAndMeta.height}
			src={pathAndMeta.src}
			alt={pathAndMeta.alt}
			{onload}
		/>
	</span>
</Layers>

<style>
	.image-wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;

		--initial-scale: 1.05;
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
