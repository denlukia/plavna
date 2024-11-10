<script lang="ts">
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import AnimatedBlock from '$lib/design/components/AnimatedBlock/AnimatedBlock.svelte';
	import ContinuousCorners from '$lib/design/components/ContinuousCorners/ContinuousCorners.svelte';
	import Image from '$lib/design/components/Image/Image.svelte';
	import PreviewFoundation from '$lib/design/components/PreviewFoundation/PreviewFoundation.svelte';
	import type { TextSizes } from '$lib/design/components/Typography/types';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

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
		if (rows > 2 && cols > 2 && text && text.length < 50) {
			return 'heading-1';
		} else if (cols > 1 || rows > 1) {
			return 'heading-2';
		} else {
			return 'headline';
		}
	}

	function getHeadingRadius(size: TextSizes) {
		if (size === 'heading-1') {
			return 35;
		} else if (size === 'heading-2') {
			return 30;
		} else {
			return 25;
		}
	}
</script>

{#snippet chip(text: string, customClass = '')}
	<div class="chip {customClass}">
		<Typography size="small-short" bold>
			<AnimatedBlock key={text}>
				{text}
			</AnimatedBlock>
		</Typography>
	</div>
{/snippet}

<PreviewFoundation>
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
											<AnimatedBlock key={description_translation}>
												<Typography size="headline-short">{description_translation}</Typography>
											</AnimatedBlock>
										</div>
									{/if}

									<AnimatedBlock key={title_translation}>
										<Typography size={titleSize}>{title_translation}</Typography>
									</AnimatedBlock>
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
		filter: drop-shadow(0 0 30px var(--text-color));
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
	}

	.bottom {
		display: flex;
		justify-content: flex-start;
		padding: var(--size-m-to-l);
	}

	.texts {
		flex-shrink: 1;
		background: var(--bg-color);
	}
	.texts.heading-1 {
		padding: var(--size-m) var(--size-l) var(--size-m);
	}
	.texts.heading-2 {
		padding: var(--size-s) var(--size-m-to-l) var(--size-s);
	}
	.texts.headline {
		padding: 0 var(--size-m) 0;
	}
	.description {
		margin-bottom: calc(var(--size-s) * -1);
	}
</style>
