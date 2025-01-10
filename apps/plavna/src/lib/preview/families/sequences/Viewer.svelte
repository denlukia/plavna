<script lang="ts">
	import { Layers, PreviewFoundation, Typography } from '@plavna/design/components';
	import type { TextSizes } from '@plavna/design/components';
	import { fade } from 'svelte/transition';
	import BasicMarkdown from '$lib/markdown/BasicMarkdown.svelte';

	import type { PreviewDataProp } from '../../types';
	import { interpolateHexColors } from './hex-interpolator';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let rect = $state({ width: 200, height: 100 });
	let spotlightTopLeft = $state({ x: -200, y: 0 });

	let {
		title_translation,
		cols,
		rows,
		prop_1: backgroundColor,
		prop_2: textColor,
		prop_3: emojiBaseColorProp,
		img_1: gridImage,
		img_2: lightsImage,
		viewing_in_article
	} = $derived(data);

	let emojiBaseColor = $derived(
		emojiBaseColorProp
			? emojiBaseColorProp
			: backgroundColor
				? interpolateHexColors(backgroundColor, '#ffffff', 0.3)
				: 'transparent'
	);

	let titleSize = $derived(getTitleSizeAndTemplate(cols, rows, title_translation?.length || 0));
	let showAdvancedLayers = $state(false);

	function getTitleSizeAndTemplate(cols: number, rows: number, length: number): TextSizes {
		const isLong = length > 60;
		if (viewing_in_article) {
			return isLong ? 'heading-2' : 'heading-1';
		}
		if (cols > 1 && rows > 1) {
			return 'heading-2';
		} else {
			return 'headline-short';
		}
	}

	function onpointermove(e: PointerEvent) {
		spotlightTopLeft = { x: e.offsetX - rect.width / 2, y: e.offsetY - rect.height / 2 };
	}
	function onpointerenter() {
		showAdvancedLayers = true;
	}
	function onpointerleave() {
		showAdvancedLayers = false;
	}
</script>

<PreviewFoundation>
	{#snippet main()}
		<div class="preview" style="--bg-color: {backgroundColor}; --text-color: {textColor};">
			<Layers stretch>
				{#if gridImage}
					<div
						class="emoji-layers"
						bind:contentRect={rect}
						{onpointermove}
						{onpointerenter}
						{onpointerleave}
						style={`
							--emoji-base-color: ${emojiBaseColor};
							--image-url: url(${gridImage.src}); 
							--image-size: ${(gridImage.width || 0) / 2}px ${(gridImage.height || 0) / 2}px;
						`}
					>
						<div class="emoji-base"></div>
					</div>

					{#if showAdvancedLayers}
						<div
							transition:fade
							class="emoji-layers advanced-layers events-none"
							style={`
						--spotlight-x: ${spotlightTopLeft.x.toFixed(0)}px;
						--spotlight-y: ${spotlightTopLeft.y.toFixed(0)}px;
						--image-url: url(${gridImage.src}); 
						--image-size: ${(gridImage.width || 0) / 2}px ${(gridImage.height || 0) / 2}px;
					`}
						>
							<div class="emoji-clear"></div>
							<div class="emoji-rainbow"></div>
						</div>
					{/if}
				{/if}
				<div class="info events-none global-fix-overflow">
					<div class="top"></div>
					<div class="title {titleSize}">
						{#if title_translation}
							<Typography size={titleSize} purpose="markdown">
								<BasicMarkdown source={title_translation} />
							</Typography>
						{/if}
					</div>
				</div>
				{#if lightsImage}
					<img class="lights events-none global-fix-overflow" alt="lights" src={lightsImage.src} />
				{/if}
				<div class="shadow events-none"></div>
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

	.emoji-layers {
		transform-origin: 25% 50%;
		transform: translate(17%, -60%) rotate(20deg);
		min-width: 200%;
		min-height: 200%;

		display: grid;
		grid-template-areas: 'a';
	}

	.emoji-layers > * {
		grid-area: a;
	}

	.emoji-base,
	.emoji-rainbow {
		mask-image: var(--image-url);
		mask-size: var(--image-size);
		mask-position: bottom left;
		mask-repeat: no-repeat;
	}

	.emoji-base {
		background-color: var(--emoji-base-color);
	}
	.emoji-rainbow {
		opacity: 0.2;

		background: radial-gradient(
			circle farthest-corner,
			rgba(0, 0, 0, 0%) 0%,
			rgb(172, 189, 194) 20%,
			rgb(207, 173, 130),
			rgb(149, 79, 50),
			rgb(84, 41, 80),
			rgb(33, 89, 138),
			rgb(65, 150, 154),
			rgb(128, 174, 123),
			rgb(184, 143, 75),
			rgb(187, 83, 79),
			rgb(123, 68, 118),
			rgb(59, 117, 114),
			rgba(58, 147, 89, 75%),
			rgba(114, 128, 81, 50%),
			rgba(166, 85, 91, 25%) 68%,
			rgba(82, 102, 87, 0%) 80%
		);

		background-position: var(--spotlight-x) var(--spotlight-y);
		background-repeat: no-repeat;
		transition: opacity 500ms;
	}

	.emoji-clear {
		background-image: var(--image-url);
		background-size: var(--image-size);
		background-repeat: no-repeat;
		background-position: bottom left;
		transform: translate3d(0, 0, 0);
		mask-image: radial-gradient(circle, #ffffffff 5%, #00000000 20%);
		mask-position: var(--spotlight-x) var(--spotlight-y);
		mask-repeat: no-repeat;
		opacity: 1;
		transition: opacity 500ms;
	}

	.lights {
		opacity: 1;
		mix-blend-mode: lighten;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.shadow {
		box-shadow:
			inset 1px 1px 0px #fff9,
			inset -1px -1px 0px #0001;
		transform: translate3d(0, 0, 0);
	}

	.top {
		display: flex;
		justify-content: flex-end;
	}

	.title {
		color: var(--text-color);
		text-shadow: 0 -1px 0px #fff6;
		hyphens: auto;
	}

	.title.heading-1 {
		padding: var(--size-m-to-l) var(--size-l) var(--size-l-to-xl);
	}
	.title.heading-2 {
		padding: var(--size-s-to-m) var(--size-m-to-l) var(--size-m-to-l);
	}
	.title.headline-short {
		padding: 0 var(--size-m) var(--size-m-to-l);
	}

	@media (max-width: 1024px) {
		.title.heading-1 {
			padding: var(--size-s-to-m) var(--size-m-to-l) var(--size-m-to-l);
		}
		.title.heading-2 {
			padding: var(--size-s-to-m) var(--size-m) var(--size-m);
		}
		.title.headline-short {
			padding: 0 var(--size-s-to-m) var(--size-s-to-m);
		}
		.title.heading-2 > :global(.text),
		.title.headline-short > :global(.text) {
			display: block;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 4;
			line-clamp: 4;
			text-overflow: ellipsis;
		}
	}

	.events-none {
		pointer-events: none;
	}
</style>
