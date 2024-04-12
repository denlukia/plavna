<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type {
		ArticleSelect,
		SectionSelect,
		TagToArticleSelect,
		TranslationUpdateZod
	} from '$lib/server/collections/types';

import type { SectionSelect } from './section/parsers';
	import SectionViewer from '../../components/SectionViewer.svelte';
	import ArticlePreview from '../common/components/ArticlePreview.svelte';
	import SectionEditor from './SectionEditor.svelte';

	export let section: {
		meta: SectionSelect;
		articles: ArticleSelect[];
		tagsArticles: TagToArticleSelect[];
	};
	export let formObj: SuperValidated<TranslationUpdateZod>;

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
