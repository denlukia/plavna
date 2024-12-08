<script lang="ts">
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import PreviewFoundation from '$lib/design/components/PreviewFoundation/PreviewFoundation.svelte';
	import type { TextSizes } from '$lib/design/components/Typography/types';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import BasicMarkdown from '$lib/features/markdown/BasicMarkdown.svelte';

	import type { PreviewDataProp } from '../../types';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let {
		title_translation,
		cols,
		rows,
		prop_1: backgroundColor,
		prop_2: textColor,
		img_1,
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

<PreviewFoundation>
	{#snippet main()}
		<div class="preview" style="--bg-color: {bgColor}; --text-color: {textColor};">
			<Layers stretch>
				{#if img_1}
					<div
						class="emoji-grid"
						style={`--mask-url: url("${img_1.src}"); --mask-size: ${(img_1.width || 540) / 2}px ${(img_1.height || 160) / 2}px;`}
					></div>
				{/if}
				<div class="info global-fix-overflow">
					<div class="top"></div>
					<div class="title {titleSize}">
						{#if title_translation}
							<Typography size={titleSize} purpose="aesthetic">
								<BasicMarkdown source={title_translation} />
							</Typography>
						{/if}
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

	.emoji-grid {
		min-width: 130%;
		opacity: 0.125;
		background-color: var(--text-color);
		mask-image: var(--mask-url);
		mask-size: var(--mask-size);
		mask-position: bottom left;
		transform: translate(7%, -25%) rotate(35deg);
		filter: drop-shadow(inset 0 0 1px var(--text-color));
	}

	.top {
		display: flex;
		justify-content: flex-end;
	}

	.title.heading-1 {
		padding: var(--size-m-to-l) var(--size-l) var(--size-l);
	}
	.title.heading-2 {
		padding: var(--size-s-to-m) var(--size-l) var(--size-m);
	}
	.title.headline-short {
		padding: 0 var(--size-m) var(--size-s);
	}

	.description {
		margin-bottom: calc(var(--size-s) * -1);
	}
</style>
