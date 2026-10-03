<script lang="ts">
	import { Typography } from '@plavna/design/components';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		align?: 'left' | 'center' | 'right' | null;
		bold?: boolean;
	};

	let { children, align = 'left', bold = false }: Props = $props();
</script>

<td style="text-align: {align ?? 'left'};">
	<Typography purpose="markdown" size="body-short" {bold}>
		{@render children()}
	</Typography>
</td>
