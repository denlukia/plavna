<script lang="ts">
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import Button from '$lib/design/components/Button/Button.svelte';
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

	let typographySize = $derived(getTypographySize(cols, rows));

	function getTypographySize(cols: number, rows: number): TextSizes {
		if (rows > 2 && cols > 2) {
			return 'heading-1';
		} else if (cols > 1 || rows > 1) {
			return 'heading-2';
		} else {
			return 'headline';
		}
	}
</script>

{#snippet chip(text: string)}
	<div class="chip">
		<Typography size="small-short">{text}</Typography>
	</div>
{/snippet}

{#snippet likeButton()}
	<Button kind="secondary">LIKE</Button>
{/snippet}

<PreviewFoundation>
	{#snippet main()}
		<ContinuousCorners radius={50} style="height: 100%;">
			<div
				class="preview"
				style="--bg-color: {backgroundColor}; --text-color: {textColor}; --image-bg: {img_1?.background}"
			>
				<Layers stretch>
					{#if img_1}
						<div class="image">
							<Image pathAndMeta={img_1} style="height: 100%; width: 100%; object-fit: cover" />
						</div>
					{/if}
					<div class="info">
						<div class="top">
							<div class="like"></div>
							<div class="chips">
								{#if publish_time}
									{@render chip(publish_time.toLocaleDateString())}
								{/if}
								{#each tags as tag}
									{#if tag}
										{@render chip(tag)}
									{/if}
								{/each}
							</div>
						</div>
						<div class="bottom">
							<Typography size="headline-short">{description_translation}</Typography>
							<Typography size={typographySize}>{title_translation}</Typography>
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
	.top,
	.bottom {
		padding: var(--size-l) var(--size-l) var(--size-m);
	}
	.top {
		display: flex;
		justify-content: space-between;
	}
	.chips {
		display: flex;
		gap: var(--size-s);
	}
	.chip {
		display: flex;
		padding: var(--size-xs) var(--size-m);
		border-radius: var(--size-full);
		background-color: var(--neutral-0-transparent-400);
		color: var(--neutral-1000);
		--blur: blur(5px);
		backdrop-filter: var(--blur);
		-webkit-backdrop-filter: var(--blur);
	}
	.bottom {
		display: flex;
		flex-direction: column;
		padding-top: 100px;
		background: linear-gradient(transparent 0%, var(--image-bg) 70%);
	}
</style>
