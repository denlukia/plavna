<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="component">
	{@render children?.()}
</div>

<style>
	.component {
		flex-grow: 1;

		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--size-l);
		background-color: var(--color-main-layout-bg);
	}
</style>
