<script lang="ts">
	import bezier from 'bezier-easing';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	type Props = {
		children: Snippet;
		key?: any;
	};

	let { key, children }: Props = $props();

	const shift = 14;
	const duration = 300;
	const delay = 150;
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
</script>

{#key key}
	<span class="animated css-intro" {style} out:fly|global={configOut}>
		{@render children()}
	</span>
{/key}

<style>
	.css-intro {
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
