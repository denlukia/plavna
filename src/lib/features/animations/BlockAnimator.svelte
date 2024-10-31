<script lang="ts">
	import { navigating } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	// import { fly } from '$lib/design/transitions/fly';

	import type { ArticleSelect } from '../article/parsers';

	type Props = Record<string, any> & {
		routeId: string;
		articleId?: ArticleSelect['id'];
		children: Snippet;
	};

	let { children, routeId, articleId }: Props = $props();

	let exiting = $derived(
		routeId === $navigating?.from?.route?.id && routeId !== $navigating?.to?.route?.id
	);

	$inspect(exiting);
</script>

{#key routeId + articleId}
	{#if !exiting}
		<!-- in:fly|global={{ duration: 400, delay: 150, y: 10, easing: cubicOut }} -->
		<div class="animation-wrapper" out:fly|global={{ duration: 500, y: -10, easing: cubicOut }}>
			{@render children()}
		</div>
	{/if}
{/key}

<style>
	.animation-wrapper {
		animation: fly-in 500ms backwards;
	}
	@keyframes fly-in {
		0% {
			opacity: 0;
			transform: translate(0, 10px);
			filter: blur(0.3em);
		}
		100% {
			opacity: 1;
			transform: translate(0, 0);
			filter: blur(0);
		}
	}
</style>
