<script lang="ts">
	import { type PreviewDataProp } from '@plavna/common';
	import {
		CustomPreviewWrapper,
		Layers,
		Typography,
		type TextSizes
	} from '@plavna/design/components';
	import { getPointerContext } from '@plavna/design/reactivity';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { interpolateHexColors } from '$lib/hex-interpolator';

	import EmojiFont from './seguiemj-1.35-flat.ttf?inline';

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
		prop_3: emojiBaseColorProp,
		prop_4: emojiProp,
		viewing_in_article
	} = $derived(data);

	let pointer = getPointerContext();

	let rect = $state({ width: 200, height: 100 });
	let spotlight = $derived.by(getSpotlightFromPointer);

	let emojiBaseColor = $derived(
		emojiBaseColorProp
			? emojiBaseColorProp
			: backgroundColor
				? interpolateHexColors(backgroundColor, '#ffffff', 0.3)
				: 'transparent'
	);

	let titleSize = $derived(getTitleSizeAndTemplate(cols, rows));
	let emoji = $derived(emojiProp || '👋 🌍 🚀');

	// Canvas-related state
	let fontLoaded = $state(false);
	let emojiCanvasDataUrl = $state<string>('');
	let canvasReady = $state(false);
	let loadedFont: FontFace | null = null;
	let imageSize = $state<string>('');

	// Load font and create canvas when component mounts or dependencies change
	$effect(async () => {
		if (emoji && cols && rows) {
			canvasReady = false; // Reset canvas ready state
			await loadEmojiFont();
			const { dataUrl, logicalSize } = await createEmojiCanvas(
				emoji,
				80,
				viewing_in_article ? 9 : cols * 2,
				viewing_in_article ? 5 : rows * 2
			);
			emojiCanvasDataUrl = `url('${dataUrl}')`;
			imageSize = `${logicalSize.width}px ${logicalSize.height}px`;
			canvasReady = true; // Mark canvas as ready
		}
	});

	function getSpotlightFromPointer() {
		if (!pointer?.current) return null;
		return {
			x: pointer.current.x - rect.width / 1.7,
			y: pointer.current.y + rect.height / 6
		};
	}

	async function loadEmojiFont(): Promise<void> {
		if (loadedFont) return;

		try {
			loadedFont = new FontFace('CustomSegoeEmoji', `url(${EmojiFont})`);
			await loadedFont.load();
			document.fonts.add(loadedFont);
			fontLoaded = true;
		} catch (error) {
			console.warn('Failed to load custom emoji font, falling back to system fonts:', error);
			fontLoaded = true; // Continue with system fonts
		}
	}

	async function createEmojiCanvas(
		emoji: string,
		size: number,
		cols: number,
		rows: number
	): Promise<{ dataUrl: string; logicalSize: { width: number; height: number } }> {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) throw new Error('Could not get canvas context');

		const dpr = 1.5;

		// Set logical canvas size
		const logicalWidth = size * cols * 1.5;
		const logicalHeight = size * rows * 1.3;

		// Set actual canvas size for retina
		canvas.width = logicalWidth * dpr;
		canvas.height = logicalHeight * dpr;

		// Set CSS size to maintain logical dimensions
		canvas.style.width = `${logicalWidth}px`;
		canvas.style.height = `${logicalHeight}px`;

		// Scale the context to match device pixel ratio
		ctx.scale(dpr, dpr);

		// Set up font with scaled size
		const fontFamily = loadedFont
			? 'CustomSegoeEmoji, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif'
			: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif';

		ctx.font = `${size}px ${fontFamily}`;
		ctx.textBaseline = 'bottom';
		ctx.textAlign = 'left';
		ctx.fillStyle = '#000'; // This will be masked anyway

		// Split emoji into segments
		const pattern1 = splitEmoji(emoji).filter((e) => e !== ' ');
		const [first, ...other] = pattern1;
		const pattern2 = other.concat(first);

		// Create alternating lines - start from bottom
		for (let row = 0; row < rows; row++) {
			const pattern = row % 2 === 0 ? pattern1 : pattern2;
			// Calculate Y position from bottom: bottom of canvas minus row offset
			const y = logicalHeight - (rows - 1 - row) * size * 1.3;

			for (let col = 0; col < cols; col++) {
				const emojiChar = pattern[col % pattern.length];
				const x = col * size * 1.5;
				ctx.fillText(emojiChar, x, y);
			}
		}

		return {
			dataUrl: canvas.toDataURL(),
			logicalSize: { width: logicalWidth, height: logicalHeight }
		};
	}

	function splitEmoji(string: string) {
		return [...new Intl.Segmenter().segment(string)].map((x) => x.segment);
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

	// Cleanup on destroy
	onMount(() => {
		return () => {
			if (loadedFont) {
				document.fonts.delete(loadedFont);
			}
		};
	});
</script>

<CustomPreviewWrapper>
	{#snippet main()}
		<div class="preview" style="--bg-color: {backgroundColor}; --text-color: {textColor};">
			<Layers stretch>
				{#if canvasReady}
					<div
						class="emoji-layers fade-in-smooth"
						bind:contentRect={rect}
						style={`
								--emoji-base-color: ${emojiBaseColor};
								--image-url: ${emojiCanvasDataUrl}; 
								--image-size: ${imageSize};
							`}
					>
						<div class="emoji-base"></div>
					</div>

					{#if spotlight}
						<div
							out:fade={{ duration: 1000 }}
							class="emoji-layers fade-in-smooth"
							style={`
							--spotlight-x: ${spotlight.x.toFixed(0)}px;
							--spotlight-y: ${spotlight.y.toFixed(0)}px;
							--image-url: ${emojiCanvasDataUrl}; 
							--image-size: ${imageSize};
						`}
						>
							<div class="emoji-clear"></div>
							<div class="emoji-rainbow"></div>
						</div>
					{/if}
				{/if}

				<div class="info global-fix-overflow">
					<div class="top"></div>
					<div class="title {titleSize}">
						{#if title_translation}
							<Typography size={titleSize} purpose="markdown">
								{title_translation}
							</Typography>
						{/if}
					</div>
				</div>

				<div class="shadow"></div>
			</Layers>
		</div>
	{/snippet}
</CustomPreviewWrapper>

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
		mask-position: bottom left;
		mask-repeat: no-repeat;
		mask-size: var(--image-size);
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
		transition: opacity 1000ms;
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
		transition: opacity 1000ms;
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
		text-wrap-style: balance;
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

	.fade-in-smooth {
		animation: fade-in 1000ms backwards;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
