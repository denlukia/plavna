<script lang="ts">
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		inArticle?: boolean;
		visible?: boolean;
	};

	let { children, inArticle = false, visible = true }: Props = $props();
</script>

<span
	class="image-wrapper"
	class:in-article={inArticle}
	class:visible
	style="--artistic-overflow: {ARTISTIC_OVERFLOW}px"
>
	{@render children()}
</span>

<style>
	.image-wrapper {
		--in-min-raw: 1025;
		--in-max-raw: 1332;
		--out-min-raw: 4;
		--out-max-raw: 0;

		--in-min: 1025px;
		--in-max: 1332px;
		--out-min: 4px;
		--out-max: 0px;

		--x: 100vw;

		--inset: clamp(
			calc(
				calc((var(--x) - var(--in-min)) / calc(var(--in-max-raw) - var(--in-min-raw))) *
					calc(var(--out-max-raw) - var(--out-min-raw)) + var(--out-min)
			),
			var(--out-max),
			var(--out-min)
		);

		display: block;
		position: absolute;

		margin-left: var(--inset);
		margin-top: var(--inset);

		width: calc(100% - var(--inset) * 2);
		height: calc(100% - var(--inset) * 2);
		overflow: hidden;

		pointer-events: none;

		opacity: 0;
		/* filter: blur(10px); */

		transition:
			filter 750ms 0ms,
			opacity 750ms 375ms;
	}

	.image-wrapper.visible {
		opacity: 1;
		/* filter: blur(0px); */
		transition:
			filter 750ms 0ms,
			opacity 750ms 0ms;
	}

	@media (max-width: 1024px) {
		.image-wrapper {
			--in-min-raw: 320;
			--in-max-raw: 796;
			--out-min-raw: 10;
			--out-max-raw: 0;

			--in-min: 320px;
			--in-max: 796px;
			--out-min: 10px;
			--out-max: 0px;
		}
		.image-wrapper.in-article {
			--out-min-raw: 12;
			--out-max-raw: 7;
			--out-min: 12px;
			--out-max: 7px;
		}
	}
</style>
