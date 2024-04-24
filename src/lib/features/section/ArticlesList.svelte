<script lang="ts">
	import { page } from '$app/stores';

	import ArticlePreview from '../article/ArticlePreview.svelte';
	import type { ArticleSelect } from '../article/parsers';
	import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();

	function getTagsForArticle(
		article: ArticleSelect,
		tagsArticles: TagToArticleSelect[],
		tags: Record<string, TagSelect> | undefined
	) {
		const selectedTags = tagsArticles.filter((el) => el.article_id === article.id);
		if (tags) {
			return selectedTags.map((tagArticle) => tags[tagArticle.tag_id]).filter(Boolean);
		} else {
			return [];
		}
	}
</script>

<div class="articles-list">
	{#each section.articles as article (article.id)}
		<ArticlePreview
			{article}
			tags={getTagsForArticle(article, section.tagsArticles, $page.data.tags)}
		/>
	{/each}
</div>
