<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setListContext } from './list-context';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setListContext();
</script>

<ol class="ordered-list">
	{@render children()}
</ol>

<style>
	.ordered-list {
		padding-left: var(--size-l);
	}
</style>
