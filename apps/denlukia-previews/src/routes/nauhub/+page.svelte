<script lang="ts">
	import { CustomPreviewWrapper, Layers } from '@plavna/design/components';
	import { getPointerContext } from '@plavna/design/reactivity';

	import AirplaneSVG from './airplane.svg?raw';
	import NauhubImage from './HQ Screenshot.png';

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

	let top = Math.floor(Math.random() * 60);
	let base = viewing_in_article ? 150 : 100;
	let scale = Math.random() > 0.5 ? base : -base;
</script>

<CustomPreviewWrapper>
	{#snippet main()}
		<Layers>
			<div class="preview">
				<img src={NauhubImage} alt="Screenshot of NAUHUB" />
			</div>
			{#if pointer?.current}
				<div class="plane-wrapper" style={`--top:${top}%;--scale:${scale}%;`}>
					{@html AirplaneSVG}
				</div>
			{/if}
		</Layers>
	{/snippet}
</CustomPreviewWrapper>

<style>
	.preview {
		background: linear-gradient(
			to bottom,
			hsl(212, 40%, 29%),
			hsl(205, 35%, 43%),
			hsl(200, 55%, 67%)
		);

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
	}

	img {
		max-height: 100%;
		max-width: 100%;
		object-fit: contain;
		mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
	}

	.plane-wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		transform: scale(var(--scale));
	}
	.plane-wrapper :global(svg) {
		position: absolute;
		top: var(--top);
		animation: fly 8s both linear;
	}
	.plane-wrapper :global(svg .animated-position) {
		animation: trace 8s both linear;
	}

	@keyframes fly {
		0% {
			transform: rotate(-25deg) translateX(-250px);
		}
		100% {
			transform: rotate(-25deg) translateX(1100px);
		}
	}
	@keyframes trace {
		0% {
			transform: translateX(250px);
		}
		100% {
			transform: translateX(-1100px);
		}
	}
</style>
