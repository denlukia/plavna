<script lang="ts">
	import { Spring } from 'svelte/motion';
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

	let rect = $state({ width: 0, height: 0 });
	let spotlightTopLeft = new Spring(
		{ x: 0, y: 0 },
		{
			stiffness: 0.2,
			damping: 0.8
		}
	);

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

	function onpointermove(e: PointerEvent) {
		spotlightTopLeft.set({ x: e.offsetX - rect.width / 2, y: e.offsetY - rect.height / 2 });
	}
	function onpointerleave() {
		spotlightTopLeft.set({ x: 0, y: 0 }, { preserveMomentum: 2000 });
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
							--spotlight-x: ${spotlightTopLeft.current.x}px;
							--spotlight-y: ${spotlightTopLeft.current.y}px;
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
		transform: translate(7%, -70%) rotate(35deg);
		min-width: 130%;
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
	}

	.emoji-base {
		background-color: hsl(31, 0%, 5%);
	}
	.emoji-rainbow {
		opacity: 0.25;
		mix-blend-mode: hard-light;
		/* background: radial-gradient(
			circle farthest-corner,
			#1b1d1f 10%,
			#96a8b3 20.72%,
			#cbccc0 29.24%,
			#c6a57a 33.15%,
			#92583a 36.29%,
			#412d58 40.12%,
			#2f5987 43.03%,
			#619d98 46.63%,
			#9ea86f 50.69%,
			#b77a4e 54.52%,
			#a84d59 57.51%,
			#7c4471 60.81%,
			#546176 63.72%,
			#51905f 69.08%,
			#a04c60 80.11%,
			#48785b 90.84%,
			#95585a 102.26%,
			#616959 110.38%,
			#5d5557 120%
		); */
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
			rgb(58, 147, 89),
			rgb(114, 128, 81),
			rgb(166, 85, 91) 68.781868%,
			rgb(82, 102, 87) 100%
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
	}

	.top {
		display: flex;
		justify-content: flex-end;
	}

	.title.heading-1 {
		padding: var(--size-m-to-l) var(--size-l) var(--size-l-to-xl);
	}
	.title.heading-2 {
		padding: var(--size-s-to-m) var(--size-m-to-l) var(--size-l);
	}
	.title.headline-short {
		padding: 0 var(--size-m-to-l) var(--size-m-to-l);
	}

	.description {
		margin-bottom: calc(var(--size-s) * -1);
	}
</style>
