<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<li class="list-item">
	{@render children()}
</li>

<style>
	.list-item {
		margin-bottom: 0.25em;

		font-family: inherit;
		font-size: inherit;
	}
</style>
