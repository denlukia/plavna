<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import type { ImagePathAndMeta } from '../../types';
	import Layers from '../ActiveElementFX/Layers.svelte';

	type Props = {
		pathAndMeta: ImagePathAndMeta;
		style?: string;
	};

	const initialOpacity = '0';
	const duration = 1000;

	let { pathAndMeta, style = '' }: Props = $props();
	let imgElement: HTMLImageElement | null = $state(null);

	let mode: 'keyframes' | 'transition' = $state('keyframes');
	let revealed = $state(false);

	function switchToTransition() {
		mode = 'transition';
	}

	function onload() {
		switchToTransition();
		revealInNextFrame();
	}

	function revealInNextFrame() {
		requestAnimationFrame(() => (revealed = true));
	}

	onMount(() => {
		if (!imgElement) return;

		const currentOpacity = getComputedStyle(imgElement).opacity;
		if (currentOpacity === initialOpacity) {
			// Keyframes didn't play yet

			switchToTransition();
			if (imgElement.naturalWidth) {
				// To have at least a ms of initial state presence for transition to play
				revealInNextFrame();
			}
		} else {
			// Keyframes started playing
			// We wait for them to finish and switch to already played transition
			imgElement.addEventListener(
				'animationend',
				() => {
					switchToTransition();
					revealed = true;
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
		animation: scaleIn var(--duration) 3s backwards var(--easing);
	}

	.transition {
		opacity: var(--initial-opacity);
		transform: scale(var(--initial-scale));
		filter: blur(var(--initial-blur));
	}

	.transition.revealed {
		transition: all var(--duration) var(--easing);

		opacity: 1;
		transform: scale(1);
		filter: blur(0);
	}

	@keyframes scaleIn {
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
