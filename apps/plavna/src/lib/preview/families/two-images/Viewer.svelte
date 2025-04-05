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
					<div class="image" style="--artistic-overflow: {ARTISTIC_OVERFLOW}px">
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
		--inset-x: calc(
			var(--artistic-overflow) -
				calc(var(--size-cell-width) / var(--size-max-cell-width) * var(--artistic-overflow))
		);
		--inset-y: calc(
			var(--artistic-overflow) -
				calc(var(--size-cell-height) / var(--size-max-cell-height) * var(--artistic-overflow))
		);

		margin-left: var(--inset-x);
		margin-top: var(--inset-y);

		width: calc(100% - var(--inset-x) * 2);
		height: calc(100% - var(--inset-y) * 2);
		overflow: hidden;
	}
</style>
