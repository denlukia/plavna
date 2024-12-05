<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setListContext } from './list-context';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setListContext();
</script>

<ul class="unordered-list">
	{@render children()}
</ul>

<style>
	.unordered-list {
		padding-left: var(--size-xl);
		margin-bottom: 1em;
	}
	:global(p) + .unordered-list {
		margin-top: -0.5em;
	}
</style>
