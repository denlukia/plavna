<script lang="ts">
	import { page } from '$app/stores';
	import { generatePath } from '$lib/features/common/links';

	import PreviewRenderer from '../preview/PreviewRenderer.svelte';
	import type { SectionProp } from '../section/types';

	type Props = {
		article: SectionProp['articles'][number];
	};

	let { article }: Props = $props();

	let { meta, tags } = $derived(article);

	let params = $derived($page.params);
</script>

<a
	class="article global-reset-link"
	style="--rows-taken:{meta.preview_rows}; --cols-taken:{meta.preview_columns}"
	href={generatePath(`/[lang]/[username]/[pageslug]/[articleslug]`, params, {
		pageslug: params.pageslug || '',
		articleslug: meta.slug
	})}
>
	<span class="height-sizer">
		<span class="preview-wrapper">
			<PreviewRenderer {article} />
		</span>
	</span>
</a>

<style>
	.article {
		display: block;

		--max-width-base: calc(var(--cols-taken) * var(--size-cell-width));
		--max-width-gaps: calc((var(--cols-taken) - 1) * var(--size-cell-gap));
		max-width: calc(var(--max-width-base) + var(--max-width-gaps));

		--width-base: calc(var(--cols-taken) / var(--count-cols-total) * 100%);
		--width-gaps: calc((var(--cols-taken) - 1) * var(--size-cell-gap));
		--width-layout-paddings: var(--size-main-layout-padding-inline) * 2;
		width: var(--width-base);

		margin-bottom: var(--size-cell-gap);
		margin-right: var(--size-cell-gap);
	}
	.height-sizer {
		display: block;
		position: relative;
		height: 0;
		--height-base: calc(var(--rows-taken) * var(--size-cell-height-unitless));
		--height-gaps: calc((var(--rows-taken) - 1) * var(--size-cell-gap-unitless));
		padding-top: calc(
			(var(--height-base) + var(--height-gaps)) / var(--size-cell-width-unitless) * 100%
		);
	}
	.preview-wrapper {
		position: absolute;

		top: calc(var(--size-cell-overflow) * -1);
		left: calc(var(--size-cell-overflow) * -1);
		right: calc(var(--size-cell-overflow) * -1);
		bottom: calc(var(--size-cell-overflow) * -1);
	}
</style>
