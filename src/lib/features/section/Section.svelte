<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';

	import ArticlePreview from '../article/ArticlePreview.svelte';
	import type { ArticleSelect } from '../article/parsers';
	import type { TranslationUpdate } from '../i18n/parsers';
	import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
	import type { SectionSelect } from './parsers';
	import SectionEditor from './SectionEditor.svelte';
	import SectionViewer from './SectionViewer.svelte';

	export let section: {
		meta: SectionSelect;
		articles: ArticleSelect[];
		tagsArticles: TagToArticleSelect[];
	};
	export let formObj: SuperValidated<TranslationUpdate>;

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

{#if $page.data.user && $page.data.user.username === $page.params.username}
	<SectionEditor section={section.meta} {formObj} />
{:else}
	<SectionViewer section={section.meta} />
{/if}

{#each section.articles as article (article.id)}
	<ArticlePreview
		{article}
		tags={getTagsForArticle(article, section.tagsArticles, $page.data.tags)}
	/>
{/each}
