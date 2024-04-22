<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/design-system/components/Button.svelte';

	import ArticlePreview from '../article/ArticlePreview.svelte';
	import type { ArticleSelect } from '../article/parsers';
	import Translation from '../i18n/Translation.svelte';
	import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
	import SectionDeletion from './SectionDeletion.svelte';
	import SectionEditor from './SectionEditor.svelte';
	import SectionViewer from './SectionViewer.svelte';
	import type { SectionProp, SectionPropWithAuthorship } from './types';

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

	function sectionHasForms(section: SectionProp): section is SectionPropWithAuthorship {
		return Boolean(section.forms);
	}
</script>

<section class="section">
	{#if sectionHasForms(section) && editorOpened}
		<SectionEditor form={section.forms.updating} oncancel={() => (editorOpened = false)} />
	{:else}
		<div class="actions-wrapper">
			<Button size="small" type="prominent" onclick={() => (editorOpened = true)}>
				<Translation key="page.section.edit" />
			</Button>
			{#if section.forms}
				<SectionDeletion form={section.forms.deletion} />
			{/if}
		</div>

		<SectionViewer {section} />
	{/if}
</section>

{#each section.articles as article (article.id)}
	<ArticlePreview
		{article}
		tags={getTagsForArticle(article, section.tagsArticles, $page.data.tags)}
	/>
{/each}

<style>
	.section {
		position: relative;
		width: var(--size-section-width);
		max-width: var(--size-section-max-width);
	}
	.section:hover .actions-wrapper {
		display: flex;
	}
	.actions-wrapper {
		display: none;
		gap: var(--size-m);
		align-items: flex-start;
		position: absolute;
		top: 0;
		left: 0;
		transform: translateY(-100%);
	}
</style>
