<script lang="ts">
	import { getGlobalTypographyClass } from '@plavna/design/components';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<strong class="{getGlobalTypographyClass('markdown')} global-text-strong">
	{@render children()}
</strong>
