<script lang="ts">
	import bezier from 'bezier-easing';
	import { type Snippet } from 'svelte';

	import { pagefly } from '../../transitions';

	type Props = {
		children: Snippet;
		key?: any;
		introDelay?: number;
		onIntroStart?: () => void;
		onOutroStart?: () => void;
	};

	let { key, children, introDelay = 0, onOutroStart, onIntroStart }: Props = $props();

	const shift = 14;
	const duration = 400;
	const easingValues = [0.2, 0, 0.2, 1] as const;
	const easingString = easingValues.join(',');

	let easing = bezier(...easingValues);

	let configOut = {
		duration: duration,
		y: -shift,
		easing,
		onOutroStart
	};

	let style = $derived(
		`--in-shift: ${shift}px;
		 --in-delay: ${introDelay}ms;
		 --in-duration: ${duration}ms;
		 --in-easing: cubic-bezier(${easingString});`
	);

	$effect(() => {
		key;
		setTimeout(() => {
			onIntroStart?.();
		}, introDelay);
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
