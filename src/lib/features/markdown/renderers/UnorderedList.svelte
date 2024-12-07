<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setListContext } from './list-context';
	import { getSectionContext } from './section-context';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setListContext();

	const sectionContext = getSectionContext();
</script>

<ul class="unordered-list global-text-aesthetic-{sectionContext?.section ? 'small' : 'body'}">
	{@render children()}
</ul>

<style>
	.unordered-list {
		padding-left: var(--size-xl);
		margin-bottom: 0.5em;
	}
	:global(p) + .unordered-list {
		margin-top: 0;
	}
</style>
