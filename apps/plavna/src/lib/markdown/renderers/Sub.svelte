<script lang="ts">
	import { getGlobalTypographyClass } from '@plavna/design/components';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<sub class="{getGlobalTypographyClass('markdown')} global-text-small-short">
	{@render children()}
</sub>
