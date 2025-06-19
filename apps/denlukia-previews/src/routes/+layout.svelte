<script lang="ts">
	import { ThemeContextProvider } from '@plavna/design/theming/components';

	import '@plavna/design/theming/styles';
	import '$lib/reset.css';

	import { createPointerContext, updatePointerFromWindowMessages } from '@plavna/design/reactivity';
	import { onMount, type Snippet } from 'svelte';

	import type { LayoutData } from './$types';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { data, children }: Props = $props();

	let { dsThemeComponentSet, themeSet } = $derived(data);

	createPointerContext();

	onMount(() => {
		const cleanup = updatePointerFromWindowMessages();
		return cleanup;
	});
</script>

<ThemeContextProvider {themeSet} components={{ designSystem: dsThemeComponentSet }}>
	{@render children()}
</ThemeContextProvider>
