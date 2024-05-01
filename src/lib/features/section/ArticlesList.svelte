<script lang="ts">
	import { page } from '$app/stores';

	import ArticlePreview from '../article/ArticlePreview.svelte';
	import type { ArticleSelect } from '../article/parsers';
	import { getNullAndDupFilter } from '../common/utils';
	import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();

	// TODO Form list of article's tags on backend
	function getTagsForArticle(
		article: ArticleSelect,
		tagsArticles: TagToArticleSelect[],
		tags: Record<string, TagSelect> | undefined
	) {
		const articleTags = tagsArticles.filter((el) => el.article_id === article.id);
		const articleTagsUnique = articleTags.filter((el, index, arr) =>
			getNullAndDupFilter('id')(el, index, arr)
		);
		if (tags) {
			return articleTagsUnique.map((tagArticle) => tags[tagArticle.tag_id]).filter(Boolean);
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
