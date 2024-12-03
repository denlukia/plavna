<script lang="ts">
	import type { Snippet } from 'svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import { getListContext } from './list-context';

	type Props = {
		children: Snippet;
	};

	let { children, ...other }: Props = $props();

	const listContext = getListContext();
</script>

{#if listContext}
	{@render children()}
{:else}
	<p class="paragraph">
		<Typography purpose="aesthetic">
			{@render children()}
		</Typography>
	</p>
{/if}

<style>
	p {
		margin-bottom: 1em;
		/* text-align: justify; */
		hyphens: auto;
	}
</style>
