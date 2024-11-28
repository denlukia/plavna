<script lang="ts">
	import type { Snippet } from 'svelte';
	import ThemeInjector from '$lib/design/components/ThemeInjector/ThemeInjector.svelte';

	import type { LayoutData } from '../$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let { themeComponentSets } = data;
</script>

<ThemeInjector {themeComponentSets} />

{@render children()}
