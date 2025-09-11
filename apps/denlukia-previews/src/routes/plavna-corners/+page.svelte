<script lang="ts">
	import { mapRange } from '@plavna/common';
	import { ContinuousCorners } from '@plavna/corners';
	import { CustomPreviewWrapper, Layers } from '@plavna/design/components';
	import { getPointerContext } from '@plavna/design/reactivity';
	import { cubicInOut, sineOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	import logo from './logo.svg?raw';

	let { data } = $props();

	let {
		title_translation,
		cols,
		rows,
		prop_1: backgroundColor,
		prop_2: textColor,
		prop_3: emojiBaseColorProp,
		prop_4: emojiProp,
		viewing_in_article,
		themeSet,
		themeComponentSets
	} = $derived(data);

	const maxRadius = 100;

	let pointer = getPointerContext();
	let rect = $state({ width: 200, height: 100 });
	let radii = $derived(getRadiusFromPointer(maxRadius, rect, pointer?.current));
	let tweenedRadii = new Tween(radii, { easing: sineOut, duration: 200 });

	$effect(() => {
		tweenedRadii.set(radii);
	});

	function getLayerParamsByIndex(index: number) {
		const hue = mapRange(index, 0, 4, 35, 5);
		const lightness = mapRange(index, 0, 4, 56, 16);
		return {
			inset: index * 20,
			backgroundColor: `hsl(${hue}deg, 100%, ${lightness}%)`
		};
	}

	function getRadiusFromPointer(
		maxRadius: number,
		rect: { width: number; height: number },
		pointer: { x: number; y: number } | null | undefined
	): [number, number, number, number] {
		if (!pointer) return [maxRadius, maxRadius, maxRadius, maxRadius];

		// Decrease radius to 0 when pointer is close to corners, based on rect,
		// zone of decrease should start at half the size of the shorter edge
		const decreaseZone = Math.min(rect.width, rect.height) / 2; // 50 for this rect

		// Calculate distances from each corner
		const topLeft = Math.sqrt(pointer.x ** 2 + pointer.y ** 2);
		const topRight = Math.sqrt((pointer.x - rect.width) ** 2 + pointer.y ** 2);
		const bottomLeft = Math.sqrt(pointer.x ** 2 + (pointer.y - rect.height) ** 2);
		const bottomRight = Math.sqrt((pointer.x - rect.width) ** 2 + (pointer.y - rect.height) ** 2);

		// Calculate radius for each corner based on its distance
		const calculateRadius = (distance: number) => {
			if (distance >= decreaseZone) {
				return maxRadius;
			}
			// Linear interpolation: closer to corner = smaller radius
			const radiusMultiplier = distance / decreaseZone;
			return maxRadius * radiusMultiplier;
		};

		return [
			calculateRadius(topLeft), // Corner 0 (top-left)
			calculateRadius(topRight), // Corner 1 (top-right)
			calculateRadius(bottomRight), // Corner 2 (bottom-right)
			calculateRadius(bottomLeft) // Corner 3 (bottom-left)
		];
	}

	function getBorderRadiusString(layerRadii: [number, number, number, number]) {
		return layerRadii.map((r) => `${r / 1.85}px`).join(' ');
	}
</script>

<CustomPreviewWrapper>
	{#snippet main()}
		<div class="squircle-preview" bind:contentRect={rect}>
			<Layers stretch style="height: 100%;">
				{#each { length: 5 } as _, index}
					{@const { inset, backgroundColor } = getLayerParamsByIndex(index)}
					{@const layerRadii = tweenedRadii.current.map((r) => Math.max(r - inset, 1)) as [
						number,
						number,
						number,
						number
					]}
					{@const borderRadiusString = getBorderRadiusString(layerRadii)}
					<div
						class="outer-shadow"
						style="margin: {inset}px; height: calc(100% - {inset *
							2}px); border-radius: {borderRadiusString}"
					>
						<ContinuousCorners radius={layerRadii} style="height: 100%;">
							<div
								class="colorizer"
								class:colorizer-zero={index === 0}
								class:colorizer-last={index === 4}
								style="background-color: {backgroundColor}; border-radius: {borderRadiusString}"
							>
								{#if index === 4}
									<div class="top">
										<div class="datum">SQUIRCLE PACKAGE</div>
										<div class="datum">SSR SUPPORT</div>
										<div class="datum">MADE FOR SVELTE</div>
									</div>
									{@html logo}
								{/if}
							</div>
						</ContinuousCorners>
					</div>
				{/each}
			</Layers>
		</div>
	{/snippet}
</CustomPreviewWrapper>

<style>
	.squircle-preview {
		height: 100%;
	}
	.outer-shadow {
		height: 100%;
		box-shadow:
			0 2px 3px hsla(0, 0%, 100%, 0.25),
			inset 0 -2px 3px hsla(0, 0%, 100%, 0.25);

		transform: translate3d(0, 0, 0);
	}
	.colorizer {
		width: 100%;
		height: 100%;
		box-shadow: inset 0 10px 20px hsla(10, 100%, 7%, 0.7);
	}
	.colorizer-last {
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		font-size: 12px;
		color: hsl(32, 100%, 54%);
		text-shadow: 0 5px 10px hsla(0, 0%, 0%, 0.7);
	}
	.top {
		display: flex;
		justify-content: space-between;
	}
	.colorizer-zero {
		box-shadow:
			inset 2px 2px 3px hsla(0, 0%, 100%, 0.3),
			inset -1px -1px 3px hsla(0, 0%, 0%, 0.2);
	}
</style>
