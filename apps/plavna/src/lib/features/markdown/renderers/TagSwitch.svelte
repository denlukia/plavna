<script lang="ts">
	import Layers from '@plavna/design/components/ActiveElementFX/Layers.svelte';
	import RainbowLoader from '@plavna/design/components/Loaders/RainbowLoader.svelte';
	import Switch from '@plavna/design/components/Switch/Switch.svelte';
	import { page } from '$app/stores';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { SECTION_RECONFIG_QUERY_PARAM_NAME } from '$lib/collections/config';
	import type { SectionContext, SectionRequest } from '$lib/features/section/types';

	const loaderDelay = 500;

	type Props = {
		tagId: number;
		children: Snippet;
	};

	let { children, tagId }: Props = $props();
	let sectionContext: SectionContext | undefined = getContext('section');
	let initialState = $derived(
		sectionContext?.activeTags.find((tag) => tag.id === tagId) ? true : false
	);
	let isLoading = $derived(sectionContext?.loadingTagId === tagId);
	let showLoader = $state(isLoading);
	let checked = $state(initialState);
	let showAsLink = $state(true);
	let sectionId = $derived(sectionContext?.id);
	let reconfigRequest: SectionRequest | null = $derived(
		sectionId
			? {
					newChecked: !checked,
					tagId,
					sectionId
				}
			: null
	);
	let reconfigRequestLink = $derived.by(() => {
		const url = new URL($page.url.href);
		url.searchParams.set(SECTION_RECONFIG_QUERY_PARAM_NAME, JSON.stringify(reconfigRequest));
		return url.toString();
	});

	onMount(() => {
		showAsLink = false;
	});

	$effect(() => {
		checked = initialState;
	});

	$effect(() => {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}
		if (isLoading) {
			timeoutId = setTimeout(() => {
				showLoader = true;
				timeoutId = null;
			}, loaderDelay);
		} else {
			showLoader = false;
		}

		return () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}
		};
	});

	function onSwitchChange(e: Event) {
		const { checked } = e.target as HTMLInputElement;
		sectionContext?.onTagSwitch?.(tagId, checked);
	}
</script>

<svelte:element
	this={showAsLink ? 'a' : 'label'}
	class="tag-switch"
	class:global-reset-link={showAsLink}
	href={showAsLink ? reconfigRequestLink : undefined}
>
	<Layers style="display: inline-grid; overflow: visible">
		<span class="content">
			{@render children()}
			<span class="switch-positioner">
				<Switch bind:checked onchange={onSwitchChange} purpose="aesthetic" />
			</span>
		</span>

		{#if showLoader}
			<div class="lights-layer" transition:fade>
				<RainbowLoader
					loading
					maskStyle={`width: calc(100% + 10px); 
										height: calc(100% + 5px); 
										border-radius: var(--size-tag-switch-border-radius);
										overflow: hidden;
										position: absolute;
										top: 0px; 
										left: -5px;`}
				/>
			</div>
		{/if}
	</Layers>
</svelte:element>

<style>
	.content {
		display: inline-flex;
		gap: var(--size-s);
	}
	.lights-layer {
		position: relative;
		border-radius: var(--size-tag-switch-border-radius);
	}
	.switch-positioner {
		transform: var(--size-tag-switch-positioner-transform);
	}
</style>
