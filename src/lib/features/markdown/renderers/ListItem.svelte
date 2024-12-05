<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getMarkdownContext } from '../markdown-context';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	const markdownContext = getMarkdownContext();
</script>

{#if markdownContext?.onlyBasic}
	{@render children()}
{:else}
	<li class="list-item">
		{@render children()}
	</li>
{/if}

<style>
	.list-item {
		margin-bottom: 0.5em;
	}
</style>
