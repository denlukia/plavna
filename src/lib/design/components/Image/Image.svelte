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
		opacity: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.no-js-animation {
		animation: fadeIn 400ms 3s forwards;
	}

	.js-animation {
		transition: opacity 400ms;
	}

	.js-animation.loaded {
		opacity: 1;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
