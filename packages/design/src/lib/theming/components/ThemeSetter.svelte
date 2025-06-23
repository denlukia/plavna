<script lang="ts">
	import { untrack, type Component, type Snippet } from 'svelte';

	import { getThemeClass, type ThemeComponentSets, type ThemeSet } from '../basics';

	type Props = {
		children: Snippet;
		themeSet: ThemeSet;
		themeComponentSets: ThemeComponentSets | null;
	};

	let { children, themeSet, themeComponentSets }: Props = $props();
</script>

{#if themeComponentSets}
	{#each Object.values(themeComponentSets) as set}
		{#each Object.values(set) as Component}
			<Component />
		{/each}
	{/each}
{/if}

<div
	class={`global-display-contents 
					${getThemeClass('typography', themeSet?.['typographyInterface'])}
					${getThemeClass('color', themeSet?.['color'])} 
					${getThemeClass('style', themeSet?.['style'])}
				 `}
>
	{@render children()}
</div>
