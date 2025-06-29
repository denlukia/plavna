<script lang="ts">
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import type { PreviewDataProp } from '@plavna/common';
	import { ImageCDN, Layers, PreviewFoundation } from '@plavna/design/components';
	import ImageWrapper from '$lib/preview/ImageWrapper.svelte';

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
			<Layers>
				{#if !viewing_in_article && img_1}
					<ImageWrapper>
						<ImageCDN
							objectFit="stretch"
							pathAndMeta={img_1}
							bgInset="{ARTISTIC_OVERFLOW}px"
							fitAndCoverParent
						/>
					</ImageWrapper>
				{/if}
				{@const oneOfImages = img_2 || img_1}
				{#if viewing_in_article && oneOfImages}
					<ImageWrapper inArticle>
						<ImageCDN
							objectFit="stretch"
							pathAndMeta={oneOfImages}
							bgInset="{ARTISTIC_OVERFLOW}px"
							fitAndCoverParent
						/>
					</ImageWrapper>
				{/if}
			</Layers>
		</div>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		height: 100%;
	}
</style>
