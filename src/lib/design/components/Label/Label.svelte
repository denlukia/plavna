<script lang="ts">
	import type { Snippet } from 'svelte';

	import Typography from '../Typography/Typography.svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<span class="label">
	<Typography size="small-short" bold>
		{@render children()}
	</Typography>
</span>

<style>
	.label {
		padding-inline: var(--label-padding-inline);
	}
</style>
