<script lang="ts">
	// import { navigating } from '$app/stores';
	import type { Snippet } from 'svelte';
	import { fly } from '$lib/design/transitions/fly';

	import type { ArticleSelect } from '../article/parsers';

	type Props = Record<string, any> & {
		routeId: string;
		articleId?: ArticleSelect['id'];
		children: Snippet;
	};

	let { children, routeId, articleId }: Props = $props();

	// let exiting = $derived(
	// 	routeId === $navigating?.from?.route?.id && routeId !== $navigating?.to?.route?.id
	// );
</script>

{#key routeId + articleId}
	<!-- {#if !exiting} -->
	<div class="animation-wrapper" out:fly|global={{ duration: 800, blur: 6, y: -10 }}>
		{@render children()}
	</div>
	<!-- {/if} -->
{/key}

<style>
	.animation-wrapper {
		animation: fly-in 1000ms 200ms cubic-bezier(0.19, 1, 0.22, 1) backwards;
	}
	@keyframes fly-in {
		0% {
			opacity: 0;
			transform: translate(0, 10px);
			filter: blur(6px);
		}
		100% {
			opacity: 1;
			transform: translate(0, 0);
			filter: blur(0);
		}
	}
</style>
