<script lang="ts">
	import Typography from '@plavna/design/components/Typography/Typography.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<em class="global-text-em">
	{@render children()}
</em>
