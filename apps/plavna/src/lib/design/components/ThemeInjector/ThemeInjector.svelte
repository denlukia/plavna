<script lang="ts">
	import type { Component } from 'svelte';

	type Props = {
		themeComponentSet: Record<string, Component>;
	};

	let { themeComponentSet }: Props = $props();
</script>

{#each Object.values(themeComponentSet) as Component}
	<Component />
{/each}
