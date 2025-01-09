<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import { createThemeContext } from '../context';
	import { getThemeClass, type ThemeSet } from '../themes';

	type Props = {
		themeSet: ThemeSet;
		components: Record<string, Record<string, Component>> | null;
		children: Snippet;
		root?: boolean;
	};

	let { components, themeSet, children, root }: Props = $props();

	createThemeContext(themeSet);
</script>

{#if components}
	{#each Object.values(components) as set}
		{#each Object.values(set) as Component}
			<Component />
		{/each}
	{/each}
{/if}

<div
	class={`${root ? 'global-theme-provider' : ''} 
					${getThemeClass('typography', themeSet['typographyInterface'])}
					${getThemeClass('color', themeSet['color'])} 
					${getThemeClass('style', themeSet['style'])}
				 `}
>
	{@render children()}
</div>
