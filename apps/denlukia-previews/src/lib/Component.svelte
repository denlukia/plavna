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
		padding: var(--size-l);
		background-color: var(--color-main-layout-bg);
	}
</style>
