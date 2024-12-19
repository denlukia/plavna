<script lang="ts">
	import type { Snippet } from 'svelte';
	import ColumnsContainer from '$lib/design/components/Grid/ColumnsContainer.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="cards">
	<ColumnsContainer>
		{@render children()}
	</ColumnsContainer>
</div>

<style>
	.cards {
		margin-top: var(--size-3xl);
	}
</style>
