<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import LabeledInput from '$lib/design-system/components/Label/LabeledInput.svelte';
	import Switch from '$lib/design-system/components/Switch/Switch.svelte';
	import Typography from '$lib/design-system/components/Typography/Typography.svelte';
	import type { SectionContext } from '$lib/features/section/types';

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

	$effect(() => {
		checked = initialState;
	});
</script>

<LabeledInput type="switch-with-bg">
	<Typography size={depthToTypographySize(headingContext?.depth)} resetPaddingBlock>
		{@render children()}
	</Typography>
	<Switch
		bind:checked
		onchange={(e) => {
    const {checked} = e.target as HTMLInputElement;
    sectionContext?.onTagSwitch?.(tagId,checked); 
  }}
	/>
</LabeledInput>
