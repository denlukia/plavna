<script lang="ts">
	import type { Tokens } from 'marked';
	import { type Snippet } from 'svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import { depthToTypographySize } from './heading-depth';

	type Props = Omit<Tokens.Heading, 'type'> & {
		children: Snippet;
	};

	let { children, depth }: Props = $props();

	let size = $derived(depthToTypographySize(depth));
</script>

<svelte:element this={`h${depth}`} class="heading {depth === 1 ? 'heading-1' : ''}">
	<Typography {size}>
		{@render children()}
	</Typography>
</svelte:element>

<style>
	.heading {
		line-height: 1;
	}
	.heading-1 {
		margin-inline-start: -0.05em;
	}
</style>
