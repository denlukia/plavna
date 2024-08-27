<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { SECTION_RECONFIG_PARAM_NAME } from '$lib/collections/constants';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Switch from '$lib/design/components/Switch/Switch.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import type { SectionContext, SectionReconfigRequest } from '$lib/features/section/types';

	import { depthToTypographySize } from './heading-depth';
	import type { HeadingContext } from './types';

	type Props = {
		tagId: number;
		children: Snippet;
	};

	let { children, tagId }: Props = $props();

	let headingContext: HeadingContext | undefined = getContext('heading');
	let sectionContext: SectionContext | undefined = getContext('section');

	const initialState = $derived(
		sectionContext?.activeTags.find((tag) => tag.id === tagId) ? true : false
	);
	let checked = $state(initialState);

	let showAsLink = $state(true);
	let sectionId = $derived(sectionContext?.id);
	let reconfigRequest: SectionReconfigRequest | null = $derived(
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
		url.searchParams.set(SECTION_RECONFIG_PARAM_NAME, JSON.stringify(reconfigRequest));
		return url.toString();
	});

	onMount(() => {
		showAsLink = false;
	});

	$effect(() => {
		checked = initialState;
	});

	function onSwitchChange(e: Event) {
		const { checked } = e.target as HTMLInputElement;
		sectionContext?.onTagSwitch?.(tagId, checked);
	}
</script>

<svelte:element
	this={showAsLink ? 'a' : 'label'}
	class="tag-switcher"
	class:global-reset-link={showAsLink}
	href={showAsLink ? reconfigRequestLink : undefined}
>
	<Typography size={depthToTypographySize(headingContext?.depth)} resetPadding>
		{@render children()}
	</Typography>
	<span class="switch-positioner">
		<Switch bind:checked onchange={onSwitchChange} />
	</span>
</svelte:element>

<style>
	.tag-switcher {
		display: inline-flex;
		gap: var(--size-s);
	}
	.switch-positioner {
		transform: translateY(var(--size-s));
	}
</style>
