<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import type { ImagePathAndMeta } from '../../types';
	import Layers from '../ActiveElementFX/Layers.svelte';

	type Props = {
		pathAndMeta: ImagePathAndMeta;
		style?: string;
	};

	let { pathAndMeta, style = '' }: Props = $props();
	let imgElement: HTMLImageElement | null = $state(null);
	let loaded = $state(false);

	function onload() {
		loaded = true;
	}

	$effect(() => {
		if (imgElement !== null && imgElement.naturalWidth) {
			onload();
		}
	});
</script>

<Layers stretch>
	<div class="bg" style="background: {pathAndMeta.background};"></div>
	<div class="image-wrapper">
		<img
			bind:this={imgElement}
			class="image {browser ? 'js-animation' : 'no-js-animation'}"
			class:loaded
			src={pathAndMeta.src}
			alt={pathAndMeta.alt}
			{style}
			{onload}
		/>
	</div>
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
	}
	.no-js-animation,
	.js-animation {
		--initial-scale: 1.05;
		--cubic-out: cubic-bezier(0.215, 0.61, 0.355, 1);
		--duration: 1000ms;

		/* FX before load */
		opacity: 0;
		transform: scale(var(--initial-scale));
		filter: blur(15px);
	}

	.no-js-animation {
		animation: scaleIn var(--duration) 3s forwards var(--cubic-out);
	}

	.js-animation {
		transition: all var(--duration) var(--cubic-out);
	}

	.js-animation.loaded {
		opacity: 1;
		transform: scale(1);
		filter: blur(0);
	}

	@keyframes scaleIn {
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}
</style>
