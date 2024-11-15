<script lang="ts">
	import { tweened } from 'svelte/motion';

	type Props = { progress?: number; kind?: 'primary' | 'translucent' };
	let { progress = 50, kind = 'primary' }: Props = $props();

	let tweenedProgress = tweened(progress);

	$effect(() => {
		tweenedProgress.set(Math.min(Math.max(progress, 0), 100));
	});
</script>

<div class="outer {kind}">
	<svg
		class="svg"
		style="--progress: {$tweenedProgress}"
		viewBox="0 0 200 200"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			vector-effect="non-scaling-stroke"
			class="spinner"
			cx="100"
			cy="100"
			r="100"
			stroke="var(--stroke)"
			stroke-width="var(--stroke-width)"
			stroke-linecap="round"
			stroke-dasharray="var(--dasharray)"
			stroke-dashoffset="var(--dashoffset)"
		/>
	</svg>
</div>

<style>
	.outer {
		width: min-content;
		padding: var(--size-loader-spinner-outer-padding);
		border-radius: var(--size-loader-spinner-radius);
	}
	.primary {
		background: var(--color-loader-spinner-kind-primary-outer-bg);
		box-shadow: var(--shadow-loader-spinner-kind-primary-outer);
		--stroke: var(--color-loader-spinner-kind-primary-line);
	}
	.translucent {
		background: var(--color-loader-spinner-kind-translucent-outer-bg);
		box-shadow: var(--shadow-loader-spinner-kind-translucent-outer);
		--stroke: var(--color-loader-spinner-kind-translucent-line);
		backdrop-filter: blur(5px);
	}

	.svg {
		display: block;
		width: var(--size-loader-spinner);
		height: var(--size-loader-spinner);
		overflow: visible;

		--stroke-width: var(--size-loader-spinner-thickness);
		--full-circle-length: calc(var(--size-loader-spinner) * 3.14);
		--dasharray: var(--full-circle-length);
		--dashoffset: calc(var(--full-circle-length) * (1 - var(--progress) / 100));
	}
	.spinner {
		transform-origin: center;
		animation: spinner 700ms infinite linear;
	}
	@keyframes spinner {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
