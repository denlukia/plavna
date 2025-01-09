<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	import { createThemeContext } from '../context';
	import { getThemeClass, type ThemeSet } from '../themes';

	type Props = {
		themeSet: ThemeSet;
		components: Record<string, Record<string, Component>> | null;
		children: Snippet;
	};

	let { components, themeSet, children }: Props = $props();

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
	class={`theme-provider 
					${getThemeClass('color', themeSet['color'])} 
					${getThemeClass('style', themeSet['style'])}
				 `}
>
	{@render children()}
</div>

<style>
	.theme-provider {
		display: contents;
	}
</style>
