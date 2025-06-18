<script lang="ts">
	import { ThemeContextProvider } from '@plavna/design/theming/components';

	import '@plavna/design/theming/styles';
	import '$lib/reset.css';

	import type { Snippet } from 'svelte';

	import type { LayoutData } from './$types';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { data, children }: Props = $props();

	let { dsThemeComponentSet, themeSet } = $derived(data);
</script>

<ThemeContextProvider {themeSet} components={{ designSystem: dsThemeComponentSet }}>
	{@render children()}
</ThemeContextProvider>
