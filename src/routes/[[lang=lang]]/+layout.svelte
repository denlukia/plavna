<script lang="ts">
	// Global CSS
	import '$lib/styles/index.css';

	import { navigating } from '$app/stores';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import GridVisualizer from '$lib/design/components/Grid/MicrogridVisualizer.svelte';
	import RainbowLoader from '$lib/design/components/Loaders/RainbowLoader.svelte';
	import Header from '$lib/features/layout/Header.svelte';
	import ThemeSetsInjector from '$lib/features/themes/components/ThemeSetsInjector.svelte';

	let { data, children } = $props();

	let { themeComponentSets } = $derived(data);

	let isNavigating = $derived(Boolean($navigating));
</script>

<svelte:head>
	<title>Plavna App</title>
	<meta name="theme-color" content="#AB948A" />
</svelte:head>

<ThemeSetsInjector {themeComponentSets} />

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
