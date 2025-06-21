<script lang="ts">
	import { Typography } from '@plavna/design/components';
	import type { Tokens } from 'marked';
	import { type Snippet } from 'svelte';

	import { getMarkdownContext } from '../../markdown-context';
	import { depthToTypographySize } from '../heading-depth';

	type Props = Omit<Tokens.Heading, 'type'> & {
		children: Snippet;
	};

	let { children, id, depth }: Props = $props();

	let markdownContext = getMarkdownContext();

	let size = $derived(depthToTypographySize(depth, markdownContext?.chooseShort));
</script>

{#if id !== 'footnote-label'}
	<svelte:element this={`h${depth}`} class="heading {size}">
		<Typography {size} purpose="markdown">
			{@render children()}
		</Typography>
	</svelte:element>
{/if}

<style>
	.heading {
		/* balanced wrapping */
		text-wrap-style: balance;
	}
	:global(.paragraph) + .heading {
		margin-top: 1.25em;
	}

	.heading + :global(.heading) {
		margin-top: 0.5em;
	}

	.heading.heading-1 + :global(.heading.heading-2) {
		margin-top: 0.75em;
	}
</style>
