<script lang="ts">
	import { MAX_ROWS_IN_SECTION } from '$lib/collections/constants';

	import ArticlePreviewCell from '../article/ArticlePreviewCell.svelte';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();
</script>

<div class="articles-list" style="--max-rows: {MAX_ROWS_IN_SECTION}">
	{#each section.articles as article (article.meta.id)}
		<ArticlePreviewCell {article} />
	{/each}
</div>

<style>
	.articles-list {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: flex-start;
		margin-top: var(--size-section-articles-margin-top);

		--max-height-base: calc(var(--max-rows) * var(--size-cell-height));
		--max-height-gaps: calc(var(--max-rows) * var(--size-cell-gap));
		max-height: calc(var(--max-height-base) + var(--max-height-gaps));
	}
</style>
