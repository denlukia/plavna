<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children, ...attributes }: Props = $props();
</script>

<li class="list-item" {...attributes}>
	{@render children()}
</li>

<style>
	.list-item {
		margin-bottom: 0.25em;

		font-family: inherit;
		font-size: inherit;
	}
</style>
