<script lang="ts">
	import { page } from '$app/stores';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
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

<GridCell colspan={meta.preview_columns} rowspan={meta.preview_rows}>
	<a
		class="article global-reset-link"
		href={generatePath(`/[lang]/[username]/[pageslug]/[articleslug]`, params, {
			pageslug: params.pageslug || '',
			articleslug: meta.slug
		})}
	>
		<span class="preview-wrapper">
			<PreviewRenderer {article} />
		</span>
	</a>
</GridCell>

<style>
	.article {
		display: block;
		width: 100%;
		height: 100%;
	}

	.preview-wrapper {
		position: absolute;

		top: calc(var(--size-cell-overflow) * -1);
		left: calc(var(--size-cell-overflow) * -1);
		right: calc(var(--size-cell-overflow) * -1);
		bottom: calc(var(--size-cell-overflow) * -1);
	}
</style>
