<script lang="ts">
	import { Spring } from 'svelte/motion';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import PreviewFoundation from '$lib/design/components/PreviewFoundation/PreviewFoundation.svelte';
	import type { TextSizes } from '$lib/design/components/Typography/types';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import BasicMarkdown from '$lib/features/markdown/BasicMarkdown.svelte';

	import type { PreviewDataProp } from '../../types';
	import { interpolateHexColors } from './hex-interpolator';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let rect = $state({ width: 200, height: 100 });
	let spotlightTopLeft = $state({ x: 0, y: 0 });

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

	let emojiBaseColor = $derived(
		bgColor && textColor ? interpolateHexColors(bgColor, textColor, 0.07) : 'transparent'
	);

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

	function onpointermove(e: PointerEvent) {
		spotlightTopLeft = { x: e.offsetX - rect.width / 2, y: e.offsetY - rect.height / 2 };
	}
</script>

<PreviewFoundation>
	{#snippet main()}
		<div class="preview" style="--bg-color: {bgColor}; --text-color: {textColor};">
			<Layers stretch>
				{#if img_1}
					<div
						class="emoji-layers"
						bind:contentRect={rect}
						{onpointermove}
						{onpointerleave}
						style={`
							--emoji-base-color: ${emojiBaseColor};
							--spotlight-x: ${spotlightTopLeft.x.toFixed(0)}px;
							--spotlight-y: ${spotlightTopLeft.y.toFixed(0)}px;
							--image-url: url("${img_1.src}"); 
							--image-size: ${(img_1.width || 540) / 2}px ${(img_1.height || 160) / 2}px;
						`}
					>
						<div class="emoji-base"></div>
						<div class="emoji-rainbow"></div>
						<div class="emoji-clear"></div>
					</div>
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
				{#if img_1}
					<div class="emoji-colorizer" style={`--image-url: url("${img_1.src}");`}></div>
				{/if}
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
		pointer-events: none;
	}

	.emoji-layers {
		/* transform: translate(7%, -50%) rotate(35deg); */
		transform-origin: 200px 50%;
		transform: translate(5%, -60%) rotate(25deg);
		min-width: 200%;
		min-height: 200%;

		display: grid;
		grid-template-areas: 'a';

		animation: reveal 1000ms 1000ms backwards;
	}

	.emoji-layers > * {
		grid-area: a;
	}

	.emoji-base,
	.emoji-rainbow {
		mask-image: var(--image-url);
		mask-size: var(--image-size);
		mask-position: bottom left;
	}

	.emoji-base {
		background-color: var(--emoji-base-color);
	}
	.emoji-rainbow {
		opacity: 0.25;
		mix-blend-mode: hard-light;

		background: radial-gradient(
			circle farthest-corner,
			rgb(0, 0, 0) 0%,
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
	}

	.emoji-clear {
		background-image: var(--image-url);
		background-size: var(--image-size);
		background-position: bottom left;
		transform: translate3d(0, 0, 0);
		mask-image: radial-gradient(circle, #ffffffff 10%, #00000000 25%);
		mask-position: var(--spotlight-x) var(--spotlight-y);
		mask-repeat: no-repeat;
		opacity: 0;
		transition: opacity 1000ms;
	}
	.emoji-clear:hover {
		opacity: 1;
	}

	.emoji-colorizer {
		opacity: 0.5;
		background-image: var(--image-url);
		background-position: bottom left;
		background-size: 110% 220%;
		filter: blur(60px);
		mix-blend-mode: screen;
		pointer-events: none;

		animation: reveal 1000ms 1000ms backwards;
	}

	.top {
		display: flex;
		justify-content: flex-end;
	}

	.title {
		background-color: #fff5;
		color: transparent;
		text-shadow: 0 1.5px 0px var(--text-color);
		-webkit-background-clip: text;
		-moz-background-clip: text;
		background-clip: text;
	}

	.title.heading-1 {
		padding: var(--size-m-to-l) var(--size-l) var(--size-l-to-xl);
	}
	.title.heading-2 {
		padding: var(--size-s-to-m) var(--size-m-to-l) var(--size-l);
	}
	.title.headline-short {
		padding: 0 var(--size-m) var(--size-m-to-l);
	}

	@keyframes reveal {
		0% {
			display: none;
			opacity: 0;
		}
	}
</style>
