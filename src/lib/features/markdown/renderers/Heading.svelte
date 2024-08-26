<script lang="ts">
	import type { Tokens } from 'marked';
	import { setContext, type Snippet } from 'svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import { depthToTypographySize } from './heading-depth';
	import type { HeadingContext } from './types';

	type Props = Omit<Tokens.Heading, 'type'> & {
		children: Snippet;
	};

	let { children, depth }: Props = $props();

	let size = $derived(depthToTypographySize(depth));

	const headingContext: HeadingContext = { depth };

	setContext('heading', headingContext);
</script>

<svelte:element this={`h${depth}`}>
	<Typography {size}>
		{@render children()}
	</Typography>
</svelte:element>
