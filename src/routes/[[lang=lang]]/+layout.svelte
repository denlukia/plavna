<script lang="ts">
	import RainbowLoader from '$lib/design/components/Loaders/RainbowLoader.svelte';

	// TODO: Dynamize based on server data

	// Static
	import '$lib/styles/index.css';
	// Dynamic Design System
	import '$lib/design/themes/color/milk/index.css';
	import '$lib/design/themes/style/modern/index.css';
	import '$lib/design/themes/typography/inter/index.css';

	// Dynamic App Theme
	// import '$lib/features/themes/style/modern/index.css';
	// import '$lib/features/themes/color/milk/index.css';
	// import '$lib/features/themes/typography/inter/index.css';

	import { navigating } from '$app/stores';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import GridVisualizer from '$lib/design/components/Grid/MicrogridVisualizer.svelte';
	import InterWOFF2 from '$lib/design/themes/typography/inter/InterVariable-subset.woff2';
	import Header from '$lib/features/layout/Header.svelte';

	let { data, children } = $props();

	let isNavigating = $derived(Boolean($navigating));

	// For Testing

	// let isNavigating = $state(false);

	// $effect(() => {
	// 	let interval = setInterval(() => {
	// 		isNavigating = !isNavigating;
	// 	}, 5000);

	// 	() => {
	// 		clearInterval(interval);
	// 	};
	// });
</script>

<svelte:head>
	<title>Plavna App</title>
	<meta name="theme-color" content="#AB948A" />

	<!-- TODO: Dynamize -->
	<link rel="preload" href={InterWOFF2} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class="main-layout">
	<div class="lights-wrapper">
		<RainbowLoader loading={isNavigating} />
	</div>
	<div class="content-wrapper">
		<Header actor={data.actor} />
		<Layers overflow="visible">
			{@render children()}
		</Layers>
	</div>
	<!-- <div class="grid-wrapper"> -->
	<GridVisualizer />
	<!-- </div> -->
	<!-- <Greetings /> -->
</div>

<style>
	.main-layout {
		position: relative;
		flex-grow: 1;
		max-width: var(--size-main-grid-max-width);
		background-color: var(--color-main-layout-bg);
		box-shadow:
			0 -100px 0 var(--color-main-layout-bg),
			0 100px 0 var(--color-main-layout-bg);
		padding-inline: var(--size-main-grid-padding-inline);
	}

	/* .grid-wrapper {
	} */

	.lights-wrapper {
		position: absolute;
		display: flex;
		justify-content: center;
		width: 100%;
		left: 0;
		overflow: hidden;
	}

	.content-wrapper {
		isolation: isolate;
		margin-top: var(--size-main-layout-margin-top);
		position: relative;
	}
</style>
