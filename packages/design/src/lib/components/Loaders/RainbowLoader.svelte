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
		animation: var(--anim-name) 2000ms linear infinite;
	}

	@keyframes -global-loader-pulse-1 {
		0.0% {
			transform: scaleX(calc(100% + var(--k) * 44%)) translateX(calc(var(--k) * 0%));
		}
		1.6% {
			transform: scaleX(calc(100% + var(--k) * 43.9%)) translateX(calc(var(--k) * -0.5%));
		}
		3.2% {
			transform: scaleX(calc(100% + var(--k) * 42.4%)) translateX(calc(var(--k) * -1.1%));
		}
		4.8% {
			transform: scaleX(calc(100% + var(--k) * 40.7%)) translateX(calc(var(--k) * -1.9%));
		}
		6.4% {
			transform: scaleX(calc(100% + var(--k) * 38.7%)) translateX(calc(var(--k) * -2.8%));
		}
		26.6% {
			transform: scaleX(calc(100% + var(--k) * 6.3%)) translateX(calc(var(--k) * -17.2%));
		}
		28.2% {
			transform: scaleX(calc(100% + var(--k) * 4.3%)) translateX(calc(var(--k) * -18.1%));
		}
		29.8% {
			transform: scaleX(calc(100% + var(--k) * 2.6%)) translateX(calc(var(--k) * -18.9%));
		}
		31.4% {
			transform: scaleX(calc(100% + var(--k) * 1.1%)) translateX(calc(var(--k) * -19.5%));
		}
		33.0% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * -20%));
		}
		34.6%,
		36.2%,
		37.8%,
		39.4%,
		59.6%,
		61.2%,
		62.8%,
		64.4%,
		66.0% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * -20%));
		}
		67.6% {
			transform: scaleX(calc(100% + var(--k) * 1.1%)) translateX(calc(var(--k) * -19.5%));
		}
		69.2% {
			transform: scaleX(calc(100% + var(--k) * 2.5%)) translateX(calc(var(--k) * -18.9%));
		}
		70.8% {
			transform: scaleX(calc(100% + var(--k) * 4.2%)) translateX(calc(var(--k) * -18.2%));
		}
		72.4% {
			transform: scaleX(calc(100% + var(--k) * 6.1%)) translateX(calc(var(--k) * -17.3%));
		}
		93.6% {
			transform: scaleX(calc(100% + var(--k) * 38.9%)) translateX(calc(var(--k) * -2.7%));
		}
		95.2% {
			transform: scaleX(calc(100% + var(--k) * 40.8%)) translateX(calc(var(--k) * -1.8%));
		}
		96.8% {
			transform: scaleX(calc(100% + var(--k) * 42.5%)) translateX(calc(var(--k) * -1.1%));
		}
		98.4% {
			transform: scaleX(calc(100% + var(--k) * 43.9%)) translateX(calc(var(--k) * -0.5%));
		}
		100.0% {
			transform: scaleX(calc(100% + var(--k) * 44%)) translateX(calc(var(--k) * 0%));
		}
	}

	@keyframes -global-loader-pulse-2 {
		0.0% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 20%));
		}
		1.6% {
			transform: scaleX(calc(100% + var(--k) * 1.1%)) translateX(calc(var(--k) * 19.5%));
		}
		3.2% {
			transform: scaleX(calc(100% + var(--k) * 2.6%)) translateX(calc(var(--k) * 18.9%));
		}
		4.8% {
			transform: scaleX(calc(100% + var(--k) * 4.3%)) translateX(calc(var(--k) * 18.1%));
		}
		6.4% {
			transform: scaleX(calc(100% + var(--k) * 6.3%)) translateX(calc(var(--k) * 17.2%));
		}
		26.6% {
			transform: scaleX(calc(100% + var(--k) * 38.7%)) translateX(calc(var(--k) * 2.8%));
		}
		28.2% {
			transform: scaleX(calc(100% + var(--k) * 40.7%)) translateX(calc(var(--k) * 1.9%));
		}
		29.8% {
			transform: scaleX(calc(100% + var(--k) * 42.4%)) translateX(calc(var(--k) * 1.1%));
		}
		31.4% {
			transform: scaleX(calc(100% + var(--k) * 43.9%)) translateX(calc(var(--k) * 0.5%));
		}
		33.0% {
			transform: scaleX(calc(100% + var(--k) * 44%)) translateX(calc(var(--k) * 0%));
		}
		34.6% {
			transform: scaleX(calc(100% + var(--k) * 43.9%)) translateX(calc(var(--k) * -0.5%));
		}
		36.2% {
			transform: scaleX(calc(100% + var(--k) * 42.4%)) translateX(calc(var(--k) * -1.1%));
		}
		37.8% {
			transform: scaleX(calc(100% + var(--k) * 40.7%)) translateX(calc(var(--k) * -1.9%));
		}
		39.4% {
			transform: scaleX(calc(100% + var(--k) * 38.7%)) translateX(calc(var(--k) * -2.8%));
		}
		59.6% {
			transform: scaleX(calc(100% + var(--k) * 6.3%)) translateX(calc(var(--k) * -17.2%));
		}
		61.2% {
			transform: scaleX(calc(100% + var(--k) * 4.3%)) translateX(calc(var(--k) * -18.1%));
		}
		62.8% {
			transform: scaleX(calc(100% + var(--k) * 2.6%)) translateX(calc(var(--k) * -18.9%));
		}
		64.4% {
			transform: scaleX(calc(100% + var(--k) * 1.1%)) translateX(calc(var(--k) * -19.5%));
		}
		66.0% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * -20%));
		}
		67.6% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * -19%));
		}
		69.2% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * -17.8%));
		}
		70.8% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * -16.3%));
		}
		72.4% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * -14.6%));
		}
		93.6% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 14.6%));
		}
		95.2% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 16.3%));
		}
		96.8% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 17.8%));
		}
		98.4% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 19%));
		}
		100.0% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 20%));
		}
	}

	@keyframes -global-loader-pulse-3 {
		0.0%,
		1.6%,
		3.2%,
		4.8%,
		6.4%,
		26.6%,
		28.2%,
		29.8%,
		31.4%,
		33.0% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 20%));
		}
		34.6% {
			transform: scaleX(calc(100% + var(--k) * 1.1%)) translateX(calc(var(--k) * 19.5%));
		}
		36.2% {
			transform: scaleX(calc(100% + var(--k) * 2.6%)) translateX(calc(var(--k) * 18.9%));
		}
		37.8% {
			transform: scaleX(calc(100% + var(--k) * 4.3%)) translateX(calc(var(--k) * 18.1%));
		}
		39.4% {
			transform: scaleX(calc(100% + var(--k) * 6.3%)) translateX(calc(var(--k) * 17.2%));
		}
		59.6% {
			transform: scaleX(calc(100% + var(--k) * 38.7%)) translateX(calc(var(--k) * 2.8%));
		}
		61.2% {
			transform: scaleX(calc(100% + var(--k) * 40.7%)) translateX(calc(var(--k) * 1.9%));
		}
		62.8% {
			transform: scaleX(calc(100% + var(--k) * 42.4%)) translateX(calc(var(--k) * 1.1%));
		}
		64.4% {
			transform: scaleX(calc(100% + var(--k) * 43.9%)) translateX(calc(var(--k) * 0.5%));
		}
		66.0% {
			transform: scaleX(calc(100% + var(--k) * 44%)) translateX(calc(var(--k) * 0%));
		}
		67.6% {
			transform: scaleX(calc(100% + var(--k) * 43.9%)) translateX(calc(var(--k) * 0.5%));
		}
		69.2% {
			transform: scaleX(calc(100% + var(--k) * 42.5%)) translateX(calc(var(--k) * 1.1%));
		}
		70.8% {
			transform: scaleX(calc(100% + var(--k) * 40.8%)) translateX(calc(var(--k) * 1.8%));
		}
		72.4% {
			transform: scaleX(calc(100% + var(--k) * 38.9%)) translateX(calc(var(--k) * 2.7%));
		}
		93.6% {
			transform: scaleX(calc(100% + var(--k) * 6.1%)) translateX(calc(var(--k) * 17.3%));
		}
		95.2% {
			transform: scaleX(calc(100% + var(--k) * 4.2%)) translateX(calc(var(--k) * 18.2%));
		}
		96.8% {
			transform: scaleX(calc(100% + var(--k) * 2.5%)) translateX(calc(var(--k) * 18.9%));
		}
		98.4% {
			transform: scaleX(calc(100% + var(--k) * 1.1%)) translateX(calc(var(--k) * 19.5%));
		}
		100.0% {
			transform: scaleX(calc(100%)) translateX(calc(var(--k) * 20%));
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
