<script lang="ts">
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
	let spotlightTopLeft = $state({ x: -200, y: 0 });

	let {
		title_translation,
		cols,
		rows,
		prop_1: backgroundColor,
		prop_2: textColor,
		prop_3: emojiBaseColorProp,
		prop_4: emojiProp,
		viewing_in_article
	} = $derived(data);

	let emojiBaseColor = $derived(
		emojiBaseColorProp
			? emojiBaseColorProp
			: backgroundColor
				? interpolateHexColors(backgroundColor, '#ffffff', 0.3)
				: 'transparent'
	);

	let titleSize = $derived(getTitleSizeAndTemplate(cols, rows));
	let emoji = $derived(emojiProp || '👋 🌍 🚀');

	let emojiSvg = getEmojiSVG(emoji, 70, 1, 1);
	let urlEncodedEmojiSvg = encodeSvgForUrl(emojiSvg);

	let gridSvg = getEmojiSVG(emoji, 70, 4, 4);
	let urlEncodedGridSvg = encodeSvgForUrl(gridSvg);

	function getEmojiSVG(emoji: string, size: number, cols: number, rows: number) {
		let pattern1 = emoji;
		let [first, ...other] = splitEmoji(pattern1);
		let pattern2 = other.join('') + first;

		let line1 = Array(cols).fill(pattern1).join(' ');
		let line2 = Array(cols).fill(pattern2).join(' ');

		function splitEmoji(string: string) {
			return [...new Intl.Segmenter().segment(string)].map((x) => x.segment);
		}

		function getText(index: number) {
			const line = index % 2 ? line1 : line2;
			return `<text x="0" y="${index * size * 1.3 + size}" font-size="${size}">${line}</text>`;
		}

		const texts = new Array(rows).fill(null).map((_, i) => {
			return getText(i);
		});

		return `
		<svg xmlns="http://www.w3.org/2000/svg" width="${size * cols * [...emoji].length * 0.7}"  height="${size * rows * 1.3}">
			${texts.join('')}
		</svg>
	`;
	}

	function encodeSvgForUrl(svgString: string) {
		const replaced = encodeURIComponent(svgString).replace(/'/g, '%27').replace(/"/g, '%22');
		return `url('data:image/svg+xml,${replaced}')`;
	}

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
		<div class="preview" style="--bg-color: {backgroundColor}; --text-color: {textColor};">
			<Layers stretch>
				<div
					class="emoji-layers"
					bind:contentRect={rect}
					{onpointermove}
					style={`
							--emoji-base-color: ${emojiBaseColor};
							--spotlight-x: ${spotlightTopLeft.x.toFixed(0)}px;
							--spotlight-y: ${spotlightTopLeft.y.toFixed(0)}px;
							--image-url: ${urlEncodedGridSvg}; 
						`}
				>
					<div class="emoji-base"></div>
					<div class="emoji-rainbow"></div>
				</div>
				<div class="emoji-filter events-none" style={`--image-url: ${urlEncodedEmojiSvg};`}></div>
				<div
					class="emoji-layers events-none"
					style={`
						--spotlight-x: ${spotlightTopLeft.x.toFixed(0)}px;
						--spotlight-y: ${spotlightTopLeft.y.toFixed(0)}px;
						--image-url: ${urlEncodedGridSvg}; 
					`}
				>
					<div class="emoji-clear"></div>
				</div>
				<div class="info events-none global-fix-overflow">
					<div class="top"></div>
					<div class="title {titleSize}">
						{#if title_translation}
							<Typography size={titleSize} purpose="aesthetic">
								<BasicMarkdown source={title_translation} />
							</Typography>
						{/if}
					</div>
				</div>

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
		/* mask-size: var(--image-size); */
		mask-position: bottom left;
	}

	.emoji-base {
		background-color: var(--emoji-base-color);
	}
	.emoji-rainbow {
		opacity: 0;
		mix-blend-mode: hard-light;

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
	.emoji-layers:hover .emoji-rainbow {
		opacity: 0.15;
	}

	.emoji-clear {
		background-image: var(--image-url);
		background-size: var(--image-size);
		background-position: bottom left;
		transform: translate3d(0, 0, 0);
		mask-image: radial-gradient(circle, #ffffffff 5%, #00000000 20%);
		mask-position: var(--spotlight-x) var(--spotlight-y);
		mask-repeat: no-repeat;
		opacity: 0;
		transition: opacity 500ms;
	}
	.emoji-layers:hover ~ * .emoji-clear {
		opacity: 1;
	}

	.emoji-filter {
		opacity: 1;
		background-image: var(--image-url);
		background-size: 100% 120%;
		background-position-y: 100%;
		filter: blur(80px) brightness(1.7);
	}

	.shadow {
		box-shadow:
			inset 1px 1px 0px #fff,
			inset -1px -1px 0px #000;
		opacity: 0.3;
		transform: translate3d(0, 0, 0);
		mix-blend-mode: overlay;
	}

	.top {
		display: flex;
		justify-content: flex-end;
	}

	.title {
		background-color: #fff6;
		color: transparent;
		text-shadow: 0 1px 0px var(--text-color);
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

	.events-none {
		pointer-events: none;
	}
</style>
