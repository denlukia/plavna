<script lang="ts">
	import { Typography } from '@plavna/design/components';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		align?: 'left' | 'center' | 'right' | null;
	};

	let { children, align = 'left' }: Props = $props();
</script>

<th style="text-align: {align ?? 'left'};">
	<Typography purpose="markdown" size="small-short" bold>
		{@render children?.()}
	</Typography>
</th>

<style>
	th {
		vertical-align: top;
		border-bottom: 1px solid currentColor;
		border-left: none;
		border-right: none;
		padding-inline: 4px;
		text-wrap: balance;
	}
</style>
