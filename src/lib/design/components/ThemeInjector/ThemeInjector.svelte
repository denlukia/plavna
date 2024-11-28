<script lang="ts">
	import type { Component } from 'svelte';

	type Props = {
		themeComponentSets: ThemeComponentSets;
	};

	let { themeComponentSets }: Props = $props();
</script>

{#if themeComponentSets}
	{#each Object.values(themeComponentSets) as themeComponentSet}
		{#each Object.values(themeComponentSet) as Component}
			<Component />
		{/each}
	{/each}
{/if}
