<script lang="ts">
	import type { Snippet } from 'svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

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
		<Typography purpose="aesthetic">
			{@render children()}
		</Typography>
	</p>
{:else}
	{@render children()}
{/if}

<style>
	p {
		margin-bottom: 0.75em;
		hyphens: auto;
		text-align: justify;
	}
</style>
