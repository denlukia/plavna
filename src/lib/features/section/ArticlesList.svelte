<script lang="ts">
	import ArticlePreviewCell from '../article/ArticlePreviewCell.svelte';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();
</script>

<div class="articles-list">
	{#each section.articles as article (article.meta.id)}
		<ArticlePreviewCell {article} />
	{/each}
</div>
