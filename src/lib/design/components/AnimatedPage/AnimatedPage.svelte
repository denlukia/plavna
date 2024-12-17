<script lang="ts">
	import bezier from 'bezier-easing';
	import { onMount, type Snippet } from 'svelte';
	import {
		PAGE_INRO_DELAY_MS,
		PAGE_TRANSITION_STATE_ATTRIBUTE_NAME
	} from '$lib/collections/config';
	import { pagefly } from '$lib/design/transitions/pagefly';

	type Props = {
		children: Snippet;
		key?: any;
	};

	let { key, children }: Props = $props();

	const shift = 14;
	const duration = 300;
	const delay = PAGE_INRO_DELAY_MS;
	const easingValues = [0.2, 0, 0.2, 1] as const;
	const easingString = easingValues.join(',');

	let easing = bezier(...easingValues);

	let configOut = { duration: duration, y: -shift, easing };

	let style = $derived(
		`--in-shift: ${shift}px;
		 --in-delay: ${delay}ms;
		 --in-duration: ${duration}ms;
		 --in-easing: cubic-bezier(${easingString});`
	);

	$effect(() => {
		key;
		setTimeout(() => {
			document.body.setAttribute(PAGE_TRANSITION_STATE_ATTRIBUTE_NAME, 'introing');
		}, delay);
	});
</script>

{#key key}
	<div class="animated-page" {style} out:pagefly|global={configOut}>
		{@render children()}
	</div>
{/key}

<style>
	.animated-page {
		animation: fly-in var(--in-duration) var(--in-delay) var(--in-easing) backwards;
	}
	@keyframes fly-in {
		0% {
			display: none;
			opacity: 0;
			transform: translate(0, var(--in-shift));
		}
		100% {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
</style>
