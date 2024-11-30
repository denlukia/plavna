<script lang="ts">
	import type { Snippet } from 'svelte';
	import ThemeSetsInjector from '$lib/features/themes/components/ThemeSetsInjector.svelte';

	import type { LayoutData } from '../$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let { themeComponentSets } = data;
</script>

<ThemeSetsInjector {themeComponentSets} />

{@render children()}
