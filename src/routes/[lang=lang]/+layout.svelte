<script lang="ts">
	import Lights from '$lib/design/components/Lights/Lights.svelte';

	import '$lib/styles/index.css';
	// TODO: Dynamize based on server data
	import '$lib/design/themes/color/milk.css';
	import '$lib/design/themes/style/modern/index.css';
	import '$lib/design/themes/typography/plavna/index.css';

	import GridVisualizer from '$lib/design/components/Grid/MicrogridVisualizer.svelte';
	import Header from '$lib/features/layout/Header.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Plavna App</title>
	<meta name="theme-color" content="#AB948A" />
</svelte:head>

<div class="main-layout">
	<div class="lights-wrapper">
		<Lights />
	</div>
	<div class="content-wrapper">
		<Header actor={data.actor} />
		{@render children()}
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
