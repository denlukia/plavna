<script lang="ts">
	import { Typography } from '@plavna/design/components';
	import type { Snippet } from 'svelte';

	import { getListContext } from './list-context';
	import { getSectionContext } from './section-context';

	type Props = {
		children: Snippet;
	};

	let { children, ...other }: Props = $props();

	const listContext = getListContext();
	const sectionContext = getSectionContext();
</script>

{#if !listContext?.list && !sectionContext?.section}
	<p class="paragraph">
		<Typography purpose="markdown">
			{@render children()}
		</Typography>
	</p>
{:else}
	{@render children()}
{/if}

<style>
	:global(.heading) + .paragraph {
		margin-top: 0.5em;
	}
	p {
		margin-bottom: 0.75em;
		hyphens: auto;
		/* text-align: justify; */
	}
</style>
