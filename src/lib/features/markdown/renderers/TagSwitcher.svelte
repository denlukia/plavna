<script lang="ts">
	import { page } from '$app/stores';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { SECTION_RECONFIG_PARAM_NAME } from '$lib/collections/constants';
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
	class="global-labeled-input-wrapper switch-with-bg"
	href={showAsLink ? reconfigRequestLink : undefined}
>
	<Typography size={depthToTypographySize(headingContext?.depth)} resetPaddingBlock>
		{@render children()}
	</Typography>
	<Switch bind:checked onchange={onSwitchChange} />
</svelte:element>

<style>
	.switch-with-bg {
		width: auto;
		padding-inline: var(--size-labeled-switch-with-bg-padding-inline);
		background: var(--color-labeled-switch-with-bg-bg);
		border-radius: var(--size-labeled-switch-with-bg-border-radius);
		/* overflow: hidden; */

		/* For Switch */
		--switch-margin-top: var(--size-labeled-switch-with-bg-margin-top);

		/* For Text */
		--text-padding-inline: var(--size-labeled-switch-with-bg-text-padding-inline);
	}
</style>
