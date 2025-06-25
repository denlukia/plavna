<script lang="ts">
	import { CustomPreviewWrapper, Layers } from '@plavna/design/components';
	import { getPointerContext } from '@plavna/design/reactivity';
	import { ThemeSetter } from '@plavna/design/theming/components';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { createEmojiCanvas } from '$lib/canvas-emojicdn.js';
	import { interpolateHexColors } from '$lib/hex-interpolator';

	let { data } = $props();

	let {
		title_translation,
		cols,
		rows,
		prop_1: backgroundColor,
		prop_2: textColor,
		prop_3: emojiBaseColorProp,
		prop_4: emojiProp,
		viewing_in_article,
		themeSet,
		themeComponentSets
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

	let titleSize = $derived(viewing_in_article ? 'heading-1' : 'heading-2');
	let emoji = $derived(emojiProp || '👋 🌍 🚀');

	// Canvas-related state

	let emojiCanvasDataUrl = $state<string>('');
	let canvasReady = $state(false);
	let imageSize = $state<string>('');

	onMount(async () => {
		const { dataUrl, logicalSize } = await createEmojiCanvas(
			emoji,
			80,
			viewing_in_article ? 9 : cols * 2 + 1,
			viewing_in_article ? 6 : rows * 2 + 1
		);
		emojiCanvasDataUrl = `url('${dataUrl}')`;
		imageSize = `${logicalSize.width}px ${logicalSize.height}px`;
		canvasReady = true; // Mark canvas as ready
	});

	function getSpotlightFromPointer() {
		if (!pointer?.current) return null;
		return {
			x: pointer.current.x - rect.width / 1.7,
			y: pointer.current.y + rect.height / 6
		};
	}
</script>

<ThemeSetter {themeSet} {themeComponentSets}>
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
								<div class="custom-typography {titleSize}">
									{title_translation}
								</div>
							{/if}
						</div>
					</div>

					<div class="shadow"></div>
				</Layers>
			</div>
		{/snippet}
	</CustomPreviewWrapper>
</ThemeSetter>

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

		--size-xs: 2px;
		--size-s: 4px;
		--size-s-to-m: 6px;
		--size-m: 8px;
		--size-m-to-l: 12px;
		--size-l: 16px;
		--size-l-to-xl: 20px;
		--size-xl: 24px;
		--size-xl-to-2xl: 28px;
		--size-2xl: 32px;
		--size-3xl: 40px;
		--size-3xl-to-4xl: 44px;
		--size-4xl: 48px;
		--size-5xl: 80px;
		--size-6xl: 128px;
		--size-full: 999px;
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

	.custom-typography {
		--text-heading-font-family: 'Inter Variable', -system-ui, sans-serif;
	}

	.custom-typography.heading-1 {
		/* --text-heading-1-font-family: var(--text-heading-font-family);
		--text-heading-1-padding-top: 0;
		--text-heading-1-padding-bottom: 0;
		--text-heading-1-size: 62px;
		--text-heading-1-weight: 900;
		--text-heading-1-line-height: 56px;
		--text-heading-1-letter-spacing: -0.01em; */

		font-family: var(--text-heading-font-family);
		padding-top: 0;
		padding-bottom: 0;
		font-size: 62px;
		font-weight: 900;
		line-height: 56px;
		letter-spacing: -0.01em;

		@media (max-width: 540px) {
			/* --text-heading-1-padding-top: 0;
		--text-heading-1-padding-bottom: 0;
		--text-heading-1-size: 34px;
		--text-heading-1-line-height: 32px;
		--text-heading-1-letter-spacing: -0.01em; */

			padding-top: 0;
			padding-bottom: 0;
			font-size: 34px;
			line-height: 32px;
			letter-spacing: -0.01em;
		}
	}

	.custom-typography.heading-2 {
		/* --text-heading-2-font-family: var(--text-heading-font-family);
		--text-heading-2-padding-top: 1px;
		--text-heading-2-padding-bottom: 3px;
		--text-heading-2-size: 30px;
		--text-heading-2-weight: 750;
		--text-heading-2-line-height: 32px;
		--text-heading-2-letter-spacing: -0.01em; */

		font-family: var(--text-heading-font-family);
		padding-top: 1px;
		padding-bottom: 3px;
		font-size: 30px;
		font-weight: 750;
		line-height: 32px;
		letter-spacing: -0.01em;

		@media (max-width: 540px) {
			/* --text-heading-2-padding-top: 1px;
		--text-heading-2-padding-bottom: 3px;
		--text-heading-2-size: 24px;
		--text-heading-2-line-height: 24px;
		--text-heading-2-letter-spacing: -0.01em; */

			padding-top: 1px;
			padding-bottom: 3px;
			font-size: 24px;
			line-height: 24px;
			letter-spacing: -0.01em;
		}
	}

	.custom-typography.headline {
		/* --text-headline-font-family: var(--text-heading-font-family);
		--text-headline-padding-top: 3px;
		--text-headline-padding-bottom: 1px;
		--text-headline-size: 18px;
		--text-headline-weight: 750;
		--text-headline-line-height: 28px;
		--text-headline-letter-spacing: 0; */

		font-family: var(--text-heading-font-family);
		padding-top: 3px;
		padding-bottom: 1px;
		font-size: 18px;
		font-weight: 750;
		line-height: 28px;
		letter-spacing: 0;

		@media (max-width: 540px) {
			/* --text-headline-padding-top: 3px;
		--text-headline-padding-bottom: 1px;
		--text-headline-size: 18px;
		--text-headline-line-height: 28px;
		--text-headline-letter-spacing: 0; */

			padding-top: 3px;
			padding-bottom: 1px;
			font-size: 18px;
			line-height: 28px;
			letter-spacing: 0;
		}
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
