<script lang="ts">
	import ColumnsContainer from '@plavna/design/components/Grid/ColumnsContainer.svelte';
	import type { Snippet } from 'svelte';

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
