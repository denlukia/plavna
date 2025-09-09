<script lang="ts">
	import { mapRange } from '@plavna/common';
	import { CustomPreviewWrapper, Layers } from '@plavna/design/components';
	import { getPointerContext } from '@plavna/design/reactivity';

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

	let pointer = getPointerContext();

	function getLayerParamsByIndex(index: number) {
		const hue = mapRange(index, 0, 4, 35, 5);
		const lightness = mapRange(index, 0, 4, 56, 16);
		return {
			inset: index * 20,
			backgroundColor: `hsl(${hue}deg, 100%, ${lightness}%)`
		};
	}
</script>

<CustomPreviewWrapper>
	{#snippet main()}
		<Layers stretch style="height: 100%;">
			{#each { length: 5 } as _, index}
				{@const { inset, backgroundColor } = getLayerParamsByIndex(index)}
				<div
					class="layer"
					class:layer-zero={index === 0}
					class:layer-last={index === 4}
					style="margin: {inset}px; height: calc(100% - {inset *
						2}px); background-color: {backgroundColor};"
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
			{/each}
		</Layers>
	{/snippet}
</CustomPreviewWrapper>

<style>
	.layer {
		box-shadow:
			inset 0 10px 20px hsla(10, 100%, 15%, 0.9),
			0 2px 2px hsla(0, 0%, 100%, 0.25);
	}
	.layer-last {
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		font-size: 13px;
		color: hsl(32, 100%, 54%);
		text-shadow: 0 5px 10px hsla(0, 0%, 0%, 0.7);
	}
	.top {
		display: flex;
		justify-content: space-between;
	}
	.layer-zero {
		box-shadow: inset 0 2px 2px hsla(0, 0%, 100%, 0.25);
	}
</style>
