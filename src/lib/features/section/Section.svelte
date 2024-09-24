<script lang="ts">
	import { page } from '$app/stores';
	import { setContext } from 'svelte';
	import InfoBlock from '$lib/design/components/InfoBlock/InfoBlock.svelte';

	import ArticlesList from '../article/ArticlesList.svelte';
	import Translation from '../i18n/Translation.svelte';
	import type { RecordsTranslationsDict } from '../i18n/types';
	import { enrichPreviewFamilies } from '../preview/enricher';
	import type { PreviewFamiliesDict } from '../preview/families/types';
	import DescriptionViewer from './DescriptionViewer.svelte';
	import SectionEditor from './SectionEditor.svelte';
	import type { SectionService } from './service';
	import type {
		SectionContext,
		SectionProp,
		SectionPropWithAuthorship,
		SectionReconfigRequest
	} from './types';

	type Props = {
		section: SectionProp;
		recordsTranslations: RecordsTranslationsDict;
		previewFamilies: PreviewFamiliesDict;
	};

	let {
		section = $bindable(),
		recordsTranslations = $bindable(),
		previewFamilies = $bindable()
	}: Props = $props();

	let editorOpened = $state(false);
	let abortController: AbortController | null = $state(null);

	function sectionHasForms(section: SectionProp): section is SectionPropWithAuthorship {
		return Boolean(section.forms);
	}

	function onEditorOpen() {
		editorOpened = true;
	}

	type SectionFetchReturn = Awaited<ReturnType<SectionService['getOne']>>;

	const sectionContext: SectionContext = $state({
		id: section.meta.id,
		activeTags: section.activeTags,
		onTagSwitch: async (tagId, checked) => {
			// Optimistic update (causes blink of empty articles block)
			// if (checked) {
			// 	section.activeTags.push({ id: tagId });
			// } else {
			// 	section.activeTags = section.activeTags.filter(({ id }) => id !== tagId);
			// }

			// Getting new articles list
			const body: SectionReconfigRequest = {
				sectionId: section.meta.id,
				tagId,
				newChecked: checked
			};
			try {
				abortController?.abort();
				abortController = new AbortController();
				const response = await fetch($page.url, {
					method: 'POST',
					body: JSON.stringify(body),
					signal: abortController?.signal
				});
				abortController = null;
				if (response.ok) {
					const result: SectionFetchReturn = await response.json();

					if (result) {
						const enriched = await enrichPreviewFamilies(result.previewFamilies, 'viewer');

						recordsTranslations = { ...recordsTranslations, ...result.recordsTranslations };
						previewFamilies = { ...previewFamilies, ...enriched };
						section = result.section;
					}
				}
			} catch (err) {
				console.error(err);
			}
		}
	});

	$effect(() => {
		sectionContext.activeTags = Array.from(section.activeTags);
	});

	setContext('section', sectionContext);
</script>

<section class="section">
	<div class="description">
		{#if sectionHasForms(section) && editorOpened}
			<SectionEditor
				mainForm={section.forms.updating}
				deletionForm={section.forms.deletion}
				onCancel={() => (editorOpened = false)}
				onSuccessfullUpdate={() => (editorOpened = false)}
			/>
		{:else}
			<DescriptionViewer {section} {onEditorOpen} showEditButton={sectionHasForms(section)} />
		{/if}
	</div>

	<div class="articles-list-wrapper">
		{#if section.articles.length > 0}
			<ArticlesList {section} />
		{:else if sectionContext.activeTags.length > 0}
			<InfoBlock>
				{#if $page.params.username === $page.data.actor?.username}
					<Translation key="page_actor.section.no_articles" />
				{:else}
					<Translation key="page.section.no_articles" />
				{/if}
			</InfoBlock>
		{/if}
	</div>
</section>

<style>
	.description {
		max-width: var(--size-section-max-width);
		transition: var(--transition-section-description);
	}

	.section {
		position: relative;
		margin-bottom: var(--size-section-margin-bottom);
	}
	.articles-list-wrapper {
		margin-top: var(--size-section-articles-list-margin-top);
		margin-inline: calc(var(--size-main-grid-padding-inline) * -1);
		overflow: auto;
		padding-bottom: var(--size-l);
		scrollbar-width: thin;
	}
</style>
