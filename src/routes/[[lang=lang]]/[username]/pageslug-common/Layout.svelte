<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { LayoutData } from '../$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let { themeComponentSet } = data;
</script>

{#each Object.values(themeComponentSet) as Component}
	<Component />
{/each}

{@render children()}
