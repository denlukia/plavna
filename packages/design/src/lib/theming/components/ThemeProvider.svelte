<script lang="ts">
	// Set global typography and other helper classes
	import '$lib/theming/styles/index.css';

	import { type Snippet } from 'svelte';
	import {
		getThemeClass,
		type ThemeComponentLayers,
		type ThemeComponentSet,
		type ThemeSet
	} from '$lib/theming/basics';

	type Props = {
		children: Snippet;
		themeSet: ThemeSet;
		themeComponentSet?: ThemeComponentSet | null;
		themeComponentLayers?: ThemeComponentLayers | null;
	};

	let { children, themeSet, themeComponentSet, themeComponentLayers }: Props = $props();
</script>

{#snippet themeComponentSetter(themeComponentSet: ThemeComponentSet)}
	{#each Object.values(themeComponentSet) as Component}
		<Component />
	{/each}
{/snippet}

{#if themeComponentLayers}
	{#each Object.values(themeComponentLayers) as set}
		{@render themeComponentSetter(set)}
	{/each}
{:else if themeComponentSet}
	{@render themeComponentSetter(themeComponentSet)}
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
