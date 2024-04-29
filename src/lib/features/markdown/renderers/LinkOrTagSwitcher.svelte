<script lang="ts">
	import type { Tokens } from 'marked';
	import { getContext, type Snippet } from 'svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Link from '$lib/design-system/components/Link.svelte';
	import Switch from '$lib/design-system/components/Switch/Switch.svelte';
	import Typography from '$lib/design-system/components/Typography/Typography.svelte';
	import type { SectionContext } from '$lib/features/section/types';

	import { depthToTypographySize } from './heading-depth';
	import type { HeadingContext } from './types';

	type Props = Omit<Tokens.Link, 'type'> & {
		children: Snippet;
	};

	let { children, href }: Props = $props();

	let tagId = href.startsWith('tag:') ? Number(href.split('tag:')[1]) : null;
	const initialState = false; // TODO Get initial state from context
	let checked = $state(initialState);

	let sectionContext: SectionContext | undefined = getContext('section');

	let headingContext: HeadingContext | undefined = getContext('heading');
</script>

{#if tagId !== null}
	<Labeled type="switch-with-bg">
		<Switch
			bind:checked
			onchange={(e) => {
				const {checked} = e.target as HTMLInputElement;
				sectionContext?.onTagSwitch?.(tagId,checked); 
			}}
		/>
		<Typography size={depthToTypographySize(headingContext?.depth)}>
			{@render children()}
		</Typography>
	</Labeled>
{:else}
	<Link {href}>
		{@render children()}
	</Link>
{/if}
