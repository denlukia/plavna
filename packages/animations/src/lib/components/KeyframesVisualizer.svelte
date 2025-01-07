<script lang="ts">
	import { map } from '$lib/utils/helpers';

	export let keyframes: Keyframe[] = [];
	export let type: 'translate' | 'scale' = 'translate';
	export let axis: 'x' | 'y' = 'x';

	// let xScale = 1200;

	function getTransformValue(transformString, transformType, axis) {
		let match;
		if (transformType === 'translate') {
			if (axis === 'x') {
				match = /translate\((.*?),/.exec(transformString);
			} else {
				match = /translate\(.*?,(.*?)\)/.exec(transformString);
			}
		} else {
			if (axis === 'x') {
				match = /scale\((.*?),/.exec(transformString);
			} else {
				match = /scale\(.*?,(.*?)\)/.exec(transformString);
			}
		}
		return match ? parseFloat(match[1]) : 0;
	}

	$: points = keyframes.map(({ transform, offset }) => [
		getTransformValue(transform, type, axis),
		offset
	]);
	$: biggest = Math.max(...points.map(([coord]) => coord));
	$: smallest = Math.min(...points.map(([coord]) => coord));
	$: delta = biggest - smallest;
	$: path = points
		.map(
			([coord, offset], index) =>
				`${index ? 'L' : 'M'} ${offset * delta},${map(
					coord,
					biggest,
					smallest,
					smallest,
					biggest
				)} `
		)
		.join('');
</script>

<div class="visualizer">
	<!-- <input bind:value={xScale} type="range" min="500" max="2000" /> -->
	<svg
		width="100%"
		height="100%"
		viewBox="{0 - delta * 0.1},{smallest - delta * 0.1},{delta + delta * 0.2},{delta + delta * 0.2}"
	>
		<path d={path} stroke="black" stroke-width={0.01 * delta} fill="none" />
		{#each points as [y, x]}
			<circle
				cx={x * delta}
				cy={map(y, biggest, smallest, smallest, biggest)}
				r={0.02 * delta}
				fill="red"
			/>
		{/each}
	</svg>
</div>

<style>
	.visualizer {
		position: absolute;
		top: 0;
		left: 0;
		width: 150px;
		margin: 10px;
		border-radius: 10px;
		padding: 5px;
		background-color: white;
	}
	svg {
		aspect-ratio: 1/1;
		border-radius: 5px;
		background-color: lightgray;
	}
</style>
