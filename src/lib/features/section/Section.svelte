<script lang="ts">
	import { page } from '$app/stores';

	import ArticlePreview from '../article/ArticlePreview.svelte';
	import type { ArticleSelect } from '../article/parsers';
	import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
	import SectionEditor from './SectionEditor.svelte';
	import SectionViewer from './SectionViewer.svelte';
	import type { SectionProp, SectionPropNonEmptyForms } from './types';

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

	function sectionHasForms(section: SectionProp): section is SectionPropNonEmptyForms {
		return Boolean(section.forms);
	}
</script>

{#if $page.data.user && $page.data.user.username === $page.params.username && sectionHasForms(section)}
	<SectionEditor {section} />
{:else}
	<SectionViewer {section} />
{/if}

{#each section.articles as article (article.id)}
	<ArticlePreview
		{article}
		tags={getTagsForArticle(article, section.tagsArticles, $page.data.tags)}
	/>
{/each}
