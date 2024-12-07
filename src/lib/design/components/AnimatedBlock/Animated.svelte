<script lang="ts">
	import bezier from 'bezier-easing';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	type Props = {
		children: Snippet;
		key?: any;
		animateIntroWithCss?: boolean;
		global?: boolean;
		text?: boolean;
	};

	let { key, animateIntroWithCss = true, global = true, text = false, children }: Props = $props();

	const shift = text ? 5 : 14;
	const duration = text ? 200 : 400;
	const delay = text ? 75 : 150;
	const easingValues = [0.2, 0, 0.2, 1] as const;
	const easingString = easingValues.join(',');

	let easing = bezier(...easingValues);
	let configIn = { duration: animateIntroWithCss ? 0 : duration, y: shift, delay: delay, easing };
	let configOut = { duration: duration, y: -shift, easing };

	let style = $derived(
		`--in-shift: ${shift}px;
		 --in-delay: ${delay}ms;
		 --in-duration: ${duration}ms;
		 --in-easing: cubic-bezier(${easingString});`
	);
</script>

{#if global}
	{#key key}
		<span
			class="animated"
			{style}
			class:css-intro={animateIntroWithCss}
			in:fly|global={configIn}
			out:fly|global={configOut}
		>
			{@render children()}
		</span>
	{/key}
{:else}
	{#key key}
		<span
			class="animated"
			{style}
			class:css-intro={animateIntroWithCss}
			in:fly={configIn}
			out:fly={configOut}
		>
			{@render children()}
		</span>
	{/key}
{/if}

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
