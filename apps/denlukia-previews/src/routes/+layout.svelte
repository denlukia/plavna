<script lang="ts">
	import '@plavna/design/theming/styles';
	import '$lib/reset.css';

	import { createPointerContext, updatePointerFromWindowMessages } from '@plavna/design/reactivity';
	import { onMount, type Snippet } from 'svelte';

	import type { LayoutData } from './$types';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { children }: Props = $props();

	createPointerContext();

	onMount(() => {
		const cleanup = updatePointerFromWindowMessages();
		return cleanup;
	});
</script>

{@render children()}
