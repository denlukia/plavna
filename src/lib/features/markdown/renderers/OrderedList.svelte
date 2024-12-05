<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getMarkdownContext } from '../markdown-context';
	import { setListContext } from './list-context';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setListContext();

	const markdownContext = getMarkdownContext();
</script>

{#if markdownContext?.onlyBasic}
	{@render children()}
{:else}
	<ol class="ordered-list">
		{@render children()}
	</ol>
{/if}

<style>
	.ordered-list {
		padding-left: var(--size-xl);
		margin-bottom: 1em;
	}

	:global(p) + .ordered-list {
		margin-top: -0.5em;
	}
</style>
