<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/design-system/components/Button.svelte';

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

	let editorOpened = $state(false);

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

{#if sectionHasForms(section) && editorOpened}
	<Button onclick={() => (editorOpened = false)}>Close Editor</Button>
	<SectionEditor {section} />
{:else}
	<Button onclick={() => (editorOpened = true)}>Edit Section</Button>
	<SectionViewer {section} />
{/if}

{#each section.articles as article (article.id)}
	<ArticlePreview
		{article}
		tags={getTagsForArticle(article, section.tagsArticles, $page.data.tags)}
	/>
{/each}
