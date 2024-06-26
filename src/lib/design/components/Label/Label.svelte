<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { TextTones } from '../Typography/types';
	import Typography from '../Typography/Typography.svelte';

	type Props = {
		children: Snippet;
		tone?: TextTones;
	};

	let { children, tone }: Props = $props();
</script>

<span class="label global-reset-line-height">
	<Typography size="small-short" {tone} bold>
		{@render children()}
	</Typography>
</span>

<style>
	.label {
		padding-inline: var(--label-padding-inline);
	}
</style>
