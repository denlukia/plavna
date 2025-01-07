<script lang="ts">
	import type { ThemeComponentSets } from '$lib/features/themes/themes';

	import ThemeInjector from '../../../design/components/ThemeInjector/ThemeInjector.svelte';

	type Props = {
		themeComponentSets: ThemeComponentSets | null;
	};

	let { themeComponentSets }: Props = $props();
</script>

{#if themeComponentSets}
	{#each Object.values(themeComponentSets) as themeComponentSet}
		<ThemeInjector {themeComponentSet} />
	{/each}
{/if}
