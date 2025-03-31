<script lang="ts">
	// Global CSS from Plavna Design
	import '@plavna/design/theming/styles';
	// Global CSS
	import '$lib/styles/index.css';

	import {
		GridVisualizer,
		Layers,
		patchScrollToDelayed,
		RainbowLoader,
		Typography
	} from '@plavna/design/components';
	import { ThemeContextProvider } from '@plavna/design/theming/components';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { dev } from '$app/environment';
	import { navigating, page } from '$app/state';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { PAGE_INRO_DELAY_MS, PAGE_SLUG_PREFIX } from '$lib/common/config.js';
	import Translation from '$lib/i18n/Translation.svelte';
	import { getLang } from '$lib/i18n/utils.js';
	import Footer from '$lib/layout/Footer.svelte';
	import Header from '$lib/layout/Header.svelte';
	import { getTitle } from '$lib/layout/title.js';

	let { data, children } = $props();

	let { themeSet, themeComponentSets } = $derived(data);

	let isNavigating = $derived(Boolean(navigating.complete));

	const mobileNonAdaptedRoutes = [
		'/[[lang=lang]]/[username]/[articleslug]/edit',
		`/[[lang=lang]]/[username]/${PAGE_SLUG_PREFIX}[pageslug]/[articleslug]/edit`
	];
	let showAdaptivityWarning = $derived(
		page.route.id && mobileNonAdaptedRoutes.includes(page.route.id)
	);

	onMount(() => {
		const unpatch = patchScrollToDelayed();

		return unpatch;
	});

	let title = $derived(getTitle(page.params));

	$inspect(page.params);

	$effect(() => {
		const lang = getLang(page.params.lang);
		document.documentElement.lang = lang;
	});

	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="theme-color" content="#AB948A" />
</svelte:head>

<ThemeContextProvider {themeSet} components={themeComponentSets}>
	<div class="global-theme-root-element">
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
			<Footer logoTextSvg={data.logoTextSvg} />
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
	</div>
</ThemeContextProvider>

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

		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

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
