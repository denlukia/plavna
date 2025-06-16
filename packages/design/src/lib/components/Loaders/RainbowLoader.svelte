<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	const defaultColors = [
		'var(--colorful-light-1)',
		'var(--colorful-light-2)',
		'var(--colorful-light-3)'
	];

	type Props = {
		loading?: boolean;
		colors?: string[];
		maxGrowth?: number;
		sinPeaksPerSecond?: number;
		maskStyle?: string;
		lightsStyle?: string;
	};

	let {
		loading = false,
		colors = defaultColors,
		maskStyle = '',
		lightsStyle = ''
	}: Props = $props();

	let k = new Tween(0, { easing: cubicInOut, duration: 1000 });

	$effect(() => {
		let target = loading ? 1 : 0;
		if (k.target !== target) k.set(target);
	});
</script>

<div class="mask" style={maskStyle}>
	<div class="lights" class:loading style={lightsStyle}>
		{#each colors as light, index}
			<div
				class="light"
				style="--color: {light}; --anim-name: loader-pulse-{index + 1}; --k: {k.current.toFixed(
					2
				)};"
			>
				<div class="left"></div>
				<div class="right"></div>
			</div>
		{/each}
	</div>
</div>

<style>
	.mask {
		width: 100%;
		display: flex;
		justify-content: center;
		mask-image: linear-gradient(
			hsla(0deg, 0%, 0%, 1) 0%,
			hsla(0deg, 0%, 0%, 0.65) 5%,
			hsla(0deg, 0%, 0%, 0.4) 15%,
			hsla(0deg, 0%, 0%, 0.2) 40%,
			hsla(0deg, 0%, 0%, 0) 100%
		);
	}
	.lights {
		display: flex;
		flex-shrink: 1;
		width: 750px;
		height: 250px;
	}
	.light {
		height: 100%;
		flex-grow: 1;
		position: relative;
		animation: var(--anim-name) 3000ms linear infinite;
	}

	@keyframes -global-loader-pulse-1 {
		0.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0%));
		}
		1.4% {
			transform: scaleX(calc(100% + var(--k) * 1.2%)) translateX(calc(var(--k) * 0%));
		}
		2.8% {
			transform: scaleX(calc(100% + var(--k) * 2.9%)) translateX(calc(var(--k) * 0%));
		}
		4.2% {
			transform: scaleX(calc(100% + var(--k) * 5.2%)) translateX(calc(var(--k) * 0%));
		}
		5.6% {
			transform: scaleX(calc(100% + var(--k) * 7.8%)) translateX(calc(var(--k) * 0%));
		}
		19.4% {
			transform: scaleX(calc(100% + var(--k) * 42.2%)) translateX(calc(var(--k) * 0%));
		}
		20.8% {
			transform: scaleX(calc(100% + var(--k) * 44.8%)) translateX(calc(var(--k) * 0%));
		}
		22.2% {
			transform: scaleX(calc(100% + var(--k) * 47.1%)) translateX(calc(var(--k) * 0%));
		}
		23.6% {
			transform: scaleX(calc(100% + var(--k) * 48.8%)) translateX(calc(var(--k) * 0%));
		}
		25.0% {
			transform: scaleX(calc(100% + var(--k) * 50%)) translateX(calc(var(--k) * 0%));
		}
		26.4% {
			transform: scaleX(calc(100% + var(--k) * 48.8%)) translateX(calc(var(--k) * -0.5%));
		}
		27.8% {
			transform: scaleX(calc(100% + var(--k) * 47.1%)) translateX(calc(var(--k) * -1.2%));
		}
		29.2% {
			transform: scaleX(calc(100% + var(--k) * 44.8%)) translateX(calc(var(--k) * -2.1%));
		}
		30.6% {
			transform: scaleX(calc(100% + var(--k) * 42.2%)) translateX(calc(var(--k) * -3.1%));
		}
		44.4% {
			transform: scaleX(calc(100% + var(--k) * 7.8%)) translateX(calc(var(--k) * -16.9%));
		}
		45.8% {
			transform: scaleX(calc(100% + var(--k) * 5.2%)) translateX(calc(var(--k) * -17.9%));
		}
		47.2% {
			transform: scaleX(calc(100% + var(--k) * 2.9%)) translateX(calc(var(--k) * -18.8%));
		}
		48.6% {
			transform: scaleX(calc(100% + var(--k) * 1.2%)) translateX(calc(var(--k) * -19.5%));
		}
		50.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		51.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		52.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		54.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		55.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		69.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		70.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		72.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		73.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		75.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		76.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -19.5%));
		}
		77.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -18.8%));
		}
		79.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -17.9%));
		}
		80.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -16.9%));
		}
		94.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -3.1%));
		}
		95.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -2.1%));
		}
		97.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -1.2%));
		}
		98.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -0.5%));
		}
		100.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0%));
		}
	}

	@keyframes -global-loader-pulse-2 {
		0.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0%));
		}
		1.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0.5%));
		}
		2.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 1.2%));
		}
		4.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 2.1%));
		}
		5.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 3.1%));
		}
		19.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 16.9%));
		}
		20.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 17.9%));
		}
		22.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 18.8%));
		}
		23.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 19.5%));
		}
		25.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		26.4% {
			transform: scaleX(calc(100% + var(--k) * 1.2%)) translateX(calc(var(--k) * 19.5%));
		}
		27.8% {
			transform: scaleX(calc(100% + var(--k) * 2.9%)) translateX(calc(var(--k) * 18.8%));
		}
		29.2% {
			transform: scaleX(calc(100% + var(--k) * 5.2%)) translateX(calc(var(--k) * 17.9%));
		}
		30.6% {
			transform: scaleX(calc(100% + var(--k) * 7.8%)) translateX(calc(var(--k) * 16.9%));
		}
		44.4% {
			transform: scaleX(calc(100% + var(--k) * 42.2%)) translateX(calc(var(--k) * 3.1%));
		}
		45.8% {
			transform: scaleX(calc(100% + var(--k) * 44.8%)) translateX(calc(var(--k) * 2.1%));
		}
		47.2% {
			transform: scaleX(calc(100% + var(--k) * 47.1%)) translateX(calc(var(--k) * 1.2%));
		}
		48.6% {
			transform: scaleX(calc(100% + var(--k) * 48.8%)) translateX(calc(var(--k) * 0.5%));
		}
		50.0% {
			transform: scaleX(calc(100% + var(--k) * 50%)) translateX(calc(var(--k) * 0%));
		}
		51.4% {
			transform: scaleX(calc(100% + var(--k) * 48.8%)) translateX(calc(var(--k) * -0.5%));
		}
		52.8% {
			transform: scaleX(calc(100% + var(--k) * 47.1%)) translateX(calc(var(--k) * -1.2%));
		}
		54.2% {
			transform: scaleX(calc(100% + var(--k) * 44.8%)) translateX(calc(var(--k) * -2.1%));
		}
		55.6% {
			transform: scaleX(calc(100% + var(--k) * 42.2%)) translateX(calc(var(--k) * -3.1%));
		}
		69.4% {
			transform: scaleX(calc(100% + var(--k) * 7.8%)) translateX(calc(var(--k) * -16.9%));
		}
		70.8% {
			transform: scaleX(calc(100% + var(--k) * 5.2%)) translateX(calc(var(--k) * -17.9%));
		}
		72.2% {
			transform: scaleX(calc(100% + var(--k) * 2.9%)) translateX(calc(var(--k) * -18.8%));
		}
		73.6% {
			transform: scaleX(calc(100% + var(--k) * 1.2%)) translateX(calc(var(--k) * -19.5%));
		}
		75.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -20%));
		}
		76.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -19.5%));
		}
		77.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -18.8%));
		}
		79.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -17.9%));
		}
		80.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -16.9%));
		}
		94.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -3.1%));
		}
		95.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -2.1%));
		}
		97.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -1.2%));
		}
		98.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * -0.5%));
		}
		100.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0%));
		}
	}

	@keyframes -global-loader-pulse-3 {
		0.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0%));
		}
		1.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0.5%));
		}
		2.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 1.2%));
		}
		4.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 2.1%));
		}
		5.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 3.1%));
		}
		19.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 16.9%));
		}
		20.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 17.9%));
		}
		22.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 18.8%));
		}
		23.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 19.5%));
		}
		25.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		26.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		27.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		29.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		30.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		44.4% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		45.8% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		47.2% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		48.6% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		50.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 20%));
		}
		51.4% {
			transform: scaleX(calc(100% + var(--k) * 1.2%)) translateX(calc(var(--k) * 19.5%));
		}
		52.8% {
			transform: scaleX(calc(100% + var(--k) * 2.9%)) translateX(calc(var(--k) * 18.8%));
		}
		54.2% {
			transform: scaleX(calc(100% + var(--k) * 5.2%)) translateX(calc(var(--k) * 17.9%));
		}
		55.6% {
			transform: scaleX(calc(100% + var(--k) * 7.8%)) translateX(calc(var(--k) * 16.9%));
		}
		69.4% {
			transform: scaleX(calc(100% + var(--k) * 42.2%)) translateX(calc(var(--k) * 3.1%));
		}
		70.8% {
			transform: scaleX(calc(100% + var(--k) * 44.8%)) translateX(calc(var(--k) * 2.1%));
		}
		72.2% {
			transform: scaleX(calc(100% + var(--k) * 47.1%)) translateX(calc(var(--k) * 1.2%));
		}
		73.6% {
			transform: scaleX(calc(100% + var(--k) * 48.8%)) translateX(calc(var(--k) * 0.5%));
		}
		75.0% {
			transform: scaleX(calc(100% + var(--k) * 50%)) translateX(calc(var(--k) * 0%));
		}
		76.4% {
			transform: scaleX(calc(100% + var(--k) * 48.8%)) translateX(calc(var(--k) * 0%));
		}
		77.8% {
			transform: scaleX(calc(100% + var(--k) * 47.1%)) translateX(calc(var(--k) * 0%));
		}
		79.2% {
			transform: scaleX(calc(100% + var(--k) * 44.8%)) translateX(calc(var(--k) * 0%));
		}
		80.6% {
			transform: scaleX(calc(100% + var(--k) * 42.2%)) translateX(calc(var(--k) * 0%));
		}
		94.4% {
			transform: scaleX(calc(100% + var(--k) * 7.8%)) translateX(calc(var(--k) * 0%));
		}
		95.8% {
			transform: scaleX(calc(100% + var(--k) * 5.2%)) translateX(calc(var(--k) * 0%));
		}
		97.2% {
			transform: scaleX(calc(100% + var(--k) * 2.9%)) translateX(calc(var(--k) * 0%));
		}
		98.6% {
			transform: scaleX(calc(100% + var(--k) * 1.2%)) translateX(calc(var(--k) * 0%));
		}
		100.0% {
			transform: scaleX(calc(100% + var(--k) * 0%)) translateX(calc(var(--k) * 0%));
		}
	}

	.left,
	.right {
		position: absolute;
		top: 0;

		height: 100%;
		width: 100%;
	}
	.left {
		background: conic-gradient(from 90deg at 50% 0%, var(--color) 0%, transparent 50%);
		mask-image: linear-gradient(to left, black calc(0% + 1px), black 50%, transparent);
		left: 0.25px;
		transform: translateX(-50%);
	}
	.right {
		background: conic-gradient(from 90deg at 50% 0%, transparent 0%, var(--color) 50%);
		mask-image: linear-gradient(to right, black 50%, transparent);
		right: 0.25px;
		transform: translateX(50%);
	}
</style>
