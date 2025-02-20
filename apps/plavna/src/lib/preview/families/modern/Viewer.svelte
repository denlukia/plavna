<script lang="ts">
	import {
		ContinuousCorners,
		Image,
		Layers,
		PreviewFoundation,
		Typography
	} from '@plavna/design/components';
	import type { TextSizes } from '@plavna/design/components';
	import { ARTISTIC_OVERFLOW_PADDING } from '$lib/common/config';

	import type { PreviewDataProp } from '../../types';

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
		likes_count
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

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW_PADDING}>
	{#snippet main()}
		<ContinuousCorners radius={50} style="height: 100%;">
			<div class="preview" style="--bg-color: {bgColor}; --text-color: {textColor};">
				<Layers stretch>
					{#if img_1}
						<div class="image">
							<Image pathAndMeta={img_1} style="height: 100%; width: 100%; object-fit: cover" />
						</div>
					{/if}
					<div class="info">
						<div class="top">
							{#if publish_time}
								{@render chip(publish_time.toLocaleDateString(), 'date')}
							{/if}
							{#each tags.toReversed() as tag}
								{#if tag}
									{@render chip(tag)}
								{/if}
							{/each}
						</div>
						<div class="bottom">
							<ContinuousCorners radius={headingRadius} style="height: 100%;">
								<div class="texts {titleSize}">
									{#if description_translation}
										<div class="description">
											<Typography size="headline-short" purpose="markdown"
												>{description_translation}</Typography
											>
										</div>
									{/if}

									<Typography size={titleSize} purpose="markdown">{title_translation}</Typography>
								</div>
							</ContinuousCorners>
						</div>
					</div>
				</Layers>
			</div>
		</ContinuousCorners>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		height: 100%;
		background: var(--bg-color);
		color: var(--text-color);
	}

	.info {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.image {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.top {
		padding: var(--size-l);
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap-reverse;
		gap: var(--size-s);
	}

	.chip {
		display: flex;
		padding: var(--size-xs) var(--size-m);
		background-color: var(--bg-color, var(--neutral-1000));
		color: var(--text-color, var(--neutral-0));
		border-radius: var(--size-full);
		transform: translate3d(0, 0, 0);
	}

	.bottom {
		display: flex;
		justify-content: flex-start;
		padding: var(--size-m-to-l);
		padding-top: 0;
	}

	.texts {
		flex-shrink: 1;
		background: var(--bg-color);
	}
	/* .texts.heading-1 {
		padding: var(--size-m-to-l) var(--size-xl) var(--size-l);
	} */
	.texts.heading-2 {
		padding: var(--size-s-to-m) var(--size-l) var(--size-m);
	}
	.texts.headline {
		padding: 0 var(--size-m) 0;
	}
	.description {
		margin-bottom: calc(var(--size-s) * -1);
	}
</style>
