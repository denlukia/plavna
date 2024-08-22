<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="cards">
	{@render children()}
</div>

<style>
	.cards {
		margin-top: var(--size-3xl);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--size-cell-gap);
	}
</style>
