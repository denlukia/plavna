<script lang="ts">
	import type { Snippet } from 'svelte';

	import Typography from './Typography/Typography.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<div class="info-block">
	<div class="text">
		<Typography size="body-short">
			{@render children()}
		</Typography>
	</div>
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
	.text {
		max-width: calc(var(--size-cell-width) * 2 + var(--size-cell-gap));
		text-align: center;
	}
</style>
