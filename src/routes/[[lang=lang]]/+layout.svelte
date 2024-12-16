<script lang="ts">
	// Global CSS
	import '$lib/styles/index.css';

	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { PAGE_INRO_DELAY_MS, PAGE_SLUG_PREFIX } from '$lib/collections/config.js';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import GridVisualizer from '$lib/design/components/Grid/MicrogridVisualizer.svelte';
	import RainbowLoader from '$lib/design/components/Loaders/RainbowLoader.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import Header from '$lib/features/layout/Header.svelte';
	import { patchScrollToDelayed } from '$lib/features/layout/scroll-delayer';
	import ThemeSetsInjector from '$lib/features/themes/components/ThemeSetsInjector.svelte';

	let { data, children } = $props();

	let { themeComponentSets } = $derived(data);

	let isNavigating = $derived(Boolean($navigating));

	const mobileNonAdaptedRoutes = [
		'/[[lang=lang]]/[username]/[articleslug]/edit',
		`/[[lang=lang]]/[username]/${PAGE_SLUG_PREFIX}[pageslug]/[articleslug]/edit`
	];
	let showAdaptivityWarning = $derived(
		$page.route.id && mobileNonAdaptedRoutes.includes($page.route.id)
	);

	onMount(() => {
		const unpatch = patchScrollToDelayed();

		return unpatch;
	});
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

	<GridVisualizer />
</div>

{#if showAdaptivityWarning}
	<div
		class="only-big-screens"
		in:fade={{ duration: PAGE_INRO_DELAY_MS }}
		out:fade={{ delay: PAGE_INRO_DELAY_MS, duration: PAGE_INRO_DELAY_MS }}
	>
		<div class="text">
			<Typography size="heading-2">
				<Translation key="layout.only_for_big_screens" />
			</Typography>
		</div>
	</div>
{/if}

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
		padding-bottom: var(--size-main-layout-padding-bottom);
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
		padding-top: var(--size-main-layout-padding-top);
		position: relative;
	}

	.only-big-screens {
		display: none;
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		justify-content: center;
		align-items: center;
		z-index: 1;
		background-color: var(--color-main-layout-bg);
	}

	@media (max-width: 1024px) {
		.only-big-screens {
			display: flex;
		}
	}
	.text {
		max-width: 300px;
		text-align: center;
	}
</style>
