<script lang="ts">
	import path from 'path';
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import type { PreviewDataProp } from '@plavna/common';
	import {
		ContinuousCorners,
		Image,
		Layers,
		PreviewFoundation,
		Typography
	} from '@plavna/design/components';
	import type { TextSizes } from '@plavna/design/components';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let {
		title_translation,
		description_translation,
		publish_time,
		cols,
		rows,
		tags,
		prop_1: frameColor,
		prop_2: matColor,
		translation_1,
		translation_2,
		img_1,
		img_2,
		likes_count,
		viewing_in_article
	} = $derived(data);

	let rotation = $derived(stableNumberFromString(img_1?.src));

	function stableNumberFromString(input: string | null | undefined): number {
		if (!input) return 0;

		const maxAngle = 2;

		return (
			((Math.abs(input.charCodeAt(input.length - 1)) % ((maxAngle * 2 + 1) * 10)) - maxAngle * 10) /
			10
		);
	}
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet main()}
		<div class="picture" style="--rotation: {rotation}deg;" class:in-article={viewing_in_article}>
			<div class="mat" style="--bg-color: {matColor};">
				{#if img_1}
					<Image pathAndMeta={img_1} style="height: 100%;" objectFit="contain" />
				{/if}
			</div>
			<div class="frame" style="--frame-color: {frameColor};"></div>
			<div class="light"></div>
			<div class="light-2"></div>
		</div>
	{/snippet}
</PreviewFoundation>

<style>
	.picture {
		transform: rotate(var(--rotation));
		height: 100%;
		position: relative;
	}
	.mat,
	.frame,
	.light,
	.light-2 {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.mat {
		padding: 20px;
		background-color: var(--bg-color);
	}
	.in-article .mat {
		padding: 40px;
	}
	.frame {
		border: 7px solid var(--frame-color);
		box-shadow:
			5px 5px 7px #0003,
			inset 5px 5px 7px #0003,
			inset -4px -4px 7px #fff3;
	}
	.in-article .frame {
		border-width: 10px;
	}
	.light {
		box-shadow:
			inset 1px 1px 1px #fff5,
			inset -1px -1px 1px #0002;
	}
	.light-2 {
		background: linear-gradient(135deg, #fff, #000);
		opacity: 0.5;
		mix-blend-mode: overlay;
	}
</style>
