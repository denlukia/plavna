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
	<ul class="unordered-list">
		{@render children()}
	</ul>
{/if}

<style>
	.unordered-list {
		padding-left: var(--size-xl);
		margin-bottom: 1em;
	}
	:global(p) + .unordered-list {
		margin-top: -0.5em;
	}
</style>
