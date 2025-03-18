<script lang="ts">
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
		prop_1: backgroundColor,
		prop_2: textColor,
		translation_1,
		translation_2,
		img_1,
		img_2,
		likes_count,
		viewing_in_article
	} = $derived(data);

	let bgColor = $derived(backgroundColor ? backgroundColor : img_1?.background);

	let titleSize = $derived(getTitleSize(cols, rows, title_translation));
	let headingRadius = $derived(getHeadingRadius(titleSize));

	function getTitleSize(cols: number, rows: number, text: typeof title_translation): TextSizes {
		// if (rows * cols > 6 && text && text.length < 40) {
		// 	return 'heading-1';
		// } else
		if (cols > 1 && rows > 1) {
			return 'heading-2';
		} else {
			return 'headline';
		}
	}

	function getHeadingRadius(size: TextSizes) {
		// if (size === 'heading-1') {
		// 	return 40;
		// } else
		if (size === 'heading-2') {
			return 30;
		} else {
			return 25;
		}
	}
</script>

{#snippet chip(text: string, customClass = '')}
	<div class="chip {customClass}">
		<Typography size="small-short" purpose="markdown">
			{text}
		</Typography>
	</div>
{/snippet}

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet overflowing()}
		<div class="preview">
			<Layers stretch>
				{#if !viewing_in_article && img_1}
					<div class="image">
						<Image pathAndMeta={img_1} style="height: 100%; width: 100%; object-fit: cover" />
					</div>
				{/if}
				{@const oneOfImages = img_2 || img_1}
				{#if viewing_in_article && oneOfImages}
					<div class="image">
						<Image pathAndMeta={oneOfImages} style="height: 100%; width: 100%; object-fit: cover" />
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
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
