<script lang="ts">
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import type { PreviewDataProp } from '@plavna/common';
	import {
		ContinuousCorners,
		ImageCDN,
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
		prop_1: backgroundColor,
		prop_2: textColor,
		translation_1,
		translation_2,
		img_1,
		img_2,
		likes_count,
		viewing_in_article
	} = $derived(data);
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet overflowing()}
		<div class="preview">
			<Layers stretch>
				{#if !viewing_in_article && img_1}
					<div class="image" style="--artistic-overflow: {ARTISTIC_OVERFLOW}px">
						<ImageCDN
							objectFit="stretch"
							pathAndMeta={img_1}
							bgInset="{ARTISTIC_OVERFLOW}px"
							style="height: 100%; width: 100%;"
						/>
					</div>
				{/if}
				{@const oneOfImages = img_2 || img_1}
				{#if viewing_in_article && oneOfImages}
					<div class="image in-article" style="--artistic-overflow: {ARTISTIC_OVERFLOW}px">
						<ImageCDN
							objectFit="stretch"
							pathAndMeta={oneOfImages}
							bgInset="{ARTISTIC_OVERFLOW}px"
							style="height: 100%; width: 100%;"
						/>
					</div>
				{/if}
			</Layers>
		</div>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		height: 100%;
	}

	.image {
		--in-min-raw: 1025;
		--in-max-raw: 1332;
		--out-min-raw: 4;
		--out-max-raw: 0;

		--in-min: 1025px;
		--in-max: 1332px;
		--out-min: 4px;
		--out-max: 0px;

		--x: 100vw;

		--inset: clamp(
			calc(
				calc((var(--x) - var(--in-min)) / calc(var(--in-max-raw) - var(--in-min-raw))) *
					calc(var(--out-max-raw) - var(--out-min-raw)) + var(--out-min)
			),
			var(--out-max),
			var(--out-min)
		);

		margin-left: var(--inset);
		margin-top: var(--inset);

		width: calc(100% - var(--inset) * 2);
		height: calc(100% - var(--inset) * 2);
		overflow: hidden;
	}

	@media (max-width: 1024px) {
		.image {
			--in-min-raw: 320;
			--in-max-raw: 796;
			--out-min-raw: 10;
			--out-max-raw: 0;

			--in-min: 320px;
			--in-max: 796px;
			--out-min: 10px;
			--out-max: 0px;
		}
		.image.in-article {
			--out-min-raw: 12;
			--out-max-raw: 7;
			--out-min: 12px;
			--out-max: 7px;
		}
	}
</style>
