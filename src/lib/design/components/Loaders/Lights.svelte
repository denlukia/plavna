<script lang="ts">
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { get } from 'svelte/store';
	import { mapRange } from '$lib/features/common/utils';

	const defaultColors = [
		'var(--colorful-light-1)',
		'var(--colorful-light-2)',
		'var(--colorful-light-3)'
	];
	const defaultWidth = '600px';
	const defaultMaxGrowth = 2;
	const baselineGrowth = 1;
	const msInSecond = 1000;

	type Props = {
		loading: boolean;
		colors?: string[];
		width?: string;
		maxGrowth?: number;
		sinPeaksPerSecond?: number;
	};

	let {
		loading = true,
		colors = defaultColors,
		width = defaultWidth,
		maxGrowth = defaultMaxGrowth,
		sinPeaksPerSecond = 3
	} = $props();

	// let interval: NodeJS.Timeout | null = $state(null);
	let timeSinceStart = $state(0);
	let currentGrowth = tweened(1, { duration: 1000, easing: cubicInOut });

	$inspect($currentGrowth);

	$effect(() => {
		if (loading) {
			currentGrowth.set(maxGrowth);
		} else {
			currentGrowth.set(1);
		}
	});

	// $effect(() => {
	// 	if ($currentGrowth > baselineGrowth && interval === null) {
	// 		const msInSecond = 1000;
	// 		const timeDivider = msInSecond / sinPeaksPerSecond;
	// 		const startTime = Date.now() / timeDivider;
	// 		interval = setInterval(() => {
	// 			if (get(currentGrowth) <= baselineGrowth) {
	// 				if (interval !== null) {
	// 					clearInterval(interval);
	// 					interval = null;
	// 				}
	// 				return;
	// 			}

	// 			const currentTime = Date.now() / timeDivider;
	// 			const timeSinceStart = currentTime - startTime;
	// 			timeSinceLastStart = timeSinceStart;
	// 		}, 100);
	// 	}

	// 	return () => {
	// 		if (interval !== null) {
	// 			clearInterval(interval);
	// 			interval = null;
	// 		}
	// 	};
	// });

	$effect(() => {
		function updateTime() {
			if (get(currentGrowth) > baselineGrowth) {
				timeSinceStart = (Date.now() / msInSecond) * sinPeaksPerSecond;
			}
			requestAnimationFrame(updateTime);
		}

		requestAnimationFrame(updateTime);
	});

	function getFlexGrow(index: number) {
		const shift = Math.PI * (index / (colors.length - 1));
		const currentSin = Math.sin(timeSinceStart - shift);
		const mapped = mapRange(currentSin, -1, 1, baselineGrowth, get(currentGrowth));

		return mapped;
	}
</script>

<div class="mask">
	<div class="lights" class:loading style="--width: {width};">
		{#each colors as light, index}
			<div class="light" style="--color: {light}; --grow: {getFlexGrow(index)}">
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
		height: 250px;
		width: var(--width);
	}
	.light {
		flex-grow: var(--grow);
		height: 100%;
		transition: flex-grow 100ms linear;
		position: relative;
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
