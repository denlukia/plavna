<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="info-block">
	{@render children()}
</div>

<style>
	.info-block {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-info-block-default-bg);
		border-radius: var(--size-info-block-border-radius);
		padding-block: var(--size-info-block-padding-block);
		padding-inline: var(--size-info-block-padding-inline);
		color: var(--color-info-block-default-text);
	}
</style>
