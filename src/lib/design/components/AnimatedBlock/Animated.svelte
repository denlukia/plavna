<script lang="ts">
	import type { Snippet } from 'svelte';
	import { translationfly } from '$lib/design/transitions/translation-fly';

	type Props = {
		children: Snippet;
		key?: any;
		animateIntroWithCss?: boolean;
		global?: boolean;
	};

	let { key, animateIntroWithCss = true, global = true, children }: Props = $props();

	let configIn = { duration: animateIntroWithCss ? 0 : 400, y: 10, delay: 350 };
	let configOut = { duration: 400, y: -5 };
</script>

{#if global}
	{#key key}
		<span
			class="animated"
			class:css-intro={animateIntroWithCss}
			in:translationfly|global={configIn}
			out:translationfly|global={configOut}
		>
			{@render children()}
		</span>
	{/key}
{:else}
	{#key key}
		<span
			class="animated"
			class:css-intro={animateIntroWithCss}
			in:translationfly={configIn}
			out:translationfly={configOut}
		>
			{@render children()}
		</span>
	{/key}
{/if}

<style>
	.css-intro {
		animation: fly-in 400ms 350ms cubic-bezier(0.215, 0.61, 0.355, 1) backwards;
	}
	@keyframes fly-in {
		0% {
			display: none;
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
