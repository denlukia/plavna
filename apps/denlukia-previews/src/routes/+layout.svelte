<script lang="ts">
	import '$lib/reset.css';

	import {
		createPointerContext,
		updatePointerFromParam,
		updatePointerFromWindowMessages
	} from '@plavna/design/reactivity';
	import { page } from '$app/state';
	import { onMount, type Snippet } from 'svelte';

	import type { LayoutData } from './$types';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};

	let { children }: Props = $props();
	let isDemoMode = $derived(page.url.searchParams.has('demo'));

	createPointerContext();

	onMount(() => {
		if (!isDemoMode) {
			const cleanup = updatePointerFromWindowMessages();
			return cleanup;
		}
	});

	function onpointermove(event: PointerEvent) {
		if (isDemoMode) {
			const { clientX, clientY } = event;
			updatePointerFromParam({ x: clientX, y: clientY });
		}
	}
</script>

<div class="pointer-tracking-wrapper" {onpointermove}>
	{@render children()}
</div>

<style>
	.pointer-tracking-wrapper {
		height: 100%;
	}
</style>
