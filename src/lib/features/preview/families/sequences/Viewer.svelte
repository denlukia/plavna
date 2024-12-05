<script lang="ts">
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import AnimatedBlock from '$lib/design/components/AnimatedBlock/AnimatedBlock.svelte';
	import ContinuousCorners from '$lib/design/components/ContinuousCorners/ContinuousCorners.svelte';
	import Image from '$lib/design/components/Image/Image.svelte';
	import PreviewFoundation from '$lib/design/components/PreviewFoundation/PreviewFoundation.svelte';
	import type { TextSizes } from '$lib/design/components/Typography/types';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import BasicMarkdown from '$lib/features/markdown/BasicMarkdown.svelte';
	import Markdown from '$lib/features/markdown/Markdown.svelte';

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
		likes_count,
		viewing_in_article
	} = $derived(data);

	let bgColor = $derived(backgroundColor ? backgroundColor : img_1?.background);

	let titleSize = $derived(getTitleSizeAndTemplate(cols, rows));

	function getTitleSizeAndTemplate(cols: number, rows: number): TextSizes {
		if (viewing_in_article) {
			return 'heading-1';
		}
		if (cols > 1 && rows > 1) {
			return 'heading-2';
		} else {
			return 'headline-short';
		}
	}
</script>

{#snippet chip(text: string, customClass = '')}
	<div class="chip {customClass}">
		<Typography size="small-short">
			<AnimatedBlock key={text}>
				{text.toUpperCase()}
			</AnimatedBlock>
		</Typography>
	</div>
{/snippet}

<PreviewFoundation>
	{#snippet main()}
		<div class="preview" style="--bg-color: {bgColor}; --text-color: {textColor};">
			<Layers stretch>
				{#if img_1}
					<div class="image">
						<Image pathAndMeta={img_1} style="height: 100%; width: 100%; object-fit: cover" />
					</div>
				{/if}
				<div class="info global-fix-overflow">
					<div class="top">
						<!-- <div class="chips">
							{#if publish_time}
								{@render chip(publish_time.toLocaleDateString(), 'date')}
							{/if}
							{#each tags.toReversed() as tag}
								{#if tag}
									{@render chip(tag)}
								{/if}
							{/each}
						</div> -->
					</div>
					<div class="bottom">
						<div class="texts {titleSize}">
							{#if description_translation}
								<div class="description">
									<AnimatedBlock key={description_translation}>
										<Typography size="headline-short" purpose="aesthetic">
											{description_translation}
										</Typography>
									</AnimatedBlock>
								</div>
							{/if}

							{#if title_translation}
								<AnimatedBlock key={title_translation}>
									<Typography size={titleSize} purpose="aesthetic">
										<BasicMarkdown source={title_translation} />
									</Typography>
								</AnimatedBlock>
							{/if}
						</div>
					</div>
				</div>
			</Layers>
		</div>
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
		display: flex;
		justify-content: flex-end;
	}

	.chips {
		display: flex;
		background-color: var(--bg-color, var(--neutral-1000));
		padding: var(--size-s-to-m) var(--size-m-to-l);
		gap: var(--size-s-to-m);
	}

	.chip {
		display: flex;
		color: var(--text-color, var(--neutral-0));
	}

	.bottom {
		display: flex;
		justify-content: flex-start;
	}

	.texts {
		flex-shrink: 1;
		background: var(--bg-color);
	}
	.texts.heading-1 {
		padding: var(--size-m-to-l) var(--size-l) var(--size-l);
	}
	.texts.heading-2 {
		padding: var(--size-s-to-m) var(--size-l) var(--size-m);
	}
	.texts.headline-short {
		padding: 0 var(--size-m) var(--size-s);
	}
	.description {
		margin-bottom: calc(var(--size-s) * -1);
	}
</style>
