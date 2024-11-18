<script lang="ts">
	import type { MaybePromise } from 'Instance';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import RainbowLoader from '$lib/design/components/Loaders/RainbowLoader.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import Translation from '../i18n/Translation.svelte';

	type Props = {
		onLoadMore: () => MaybePromise;
		threshold?: number;
		href?: string;
	};

	let { onLoadMore, threshold = 0.5, href }: Props = $props();

	let observer: IntersectionObserver;
	let element: HTMLElement;

	let loading = $state(false);

	onMount(() => {
		if (!onLoadMore || threshold < 0 || threshold > 1) {
			throw new Error('Ensure onLoadMore is defined and threshold is between 0 and 1.');
		}

		observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.intersectionRatio >= threshold && !loading) {
					loading = true;
					await onLoadMore();
					setTimeout(() => {
						loading = false;
					}, 1000);
				}
			},
			{ threshold }
		);

		if (element) {
			observer.observe(element);
		}

		return () => {
			if (observer && element) {
				observer.unobserve(element);
			}
		};
	});
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	class="load-more"
	class:loading
	bind:this={element}
>
	<Layers stretch>
		<!-- {#if loading} -->
		<div class="rainbow-wrapper" transition:fade>
			<RainbowLoader
				maskStyle="position: absolute;"
				lightsStyle="width: calc(100% - 60px); left: 30px; height: 100px;"
				{loading}
			/>
		</div>
		<!-- {/if} -->

		<div class="text-layer">
			<Typography size="headline">
				<Translation key="page.section.{loading ? 'loading_more' : 'load_more'}" />
			</Typography>
		</div>
	</Layers>
</svelte:element>

<style>
	.load-more {
		height: 100%;
		border-radius: var(--size-section-load-more-border-radius);
		overflow: hidden;
	}
	.rainbow-wrapper {
		position: relative;
	}
	.text-layer {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: var(--size-section-load-more-padding);
	}
</style>
