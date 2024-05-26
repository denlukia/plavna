<script lang="ts">
	import { page } from '$app/stores';
	import { setContext } from 'svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import Translation from '../i18n/Translation.svelte';
	import type { RecordsTranslations } from '../i18n/types';
	import { enrichPreviewFamilies } from '../preview/enricher';
	import type { PreviewFamiliesDict } from '../preview/families/types';
	import ArticlesList from './ArticlesList.svelte';
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
		recordsTranslations: RecordsTranslations;
		previewFamilies: PreviewFamiliesDict;
	};

	let {
		section = $bindable(),
		recordsTranslations = $bindable(),
		previewFamilies = $bindable()
	}: Props = $props();

	let editorOpened = $state(false);

	function sectionHasForms(section: SectionProp): section is SectionPropWithAuthorship {
		return Boolean(section.forms);
	}

	function onEditorOpen() {
		editorOpened = true;
	}

	type SectionFetchReturn = Awaited<ReturnType<SectionService['getOne']>>;

	const sectionContext: SectionContext = $state({
		activeTags: section.activeTags,
		onTagSwitch: async (tagId, checked) => {
			// Optimistic update
			if (checked) {
				section.activeTags.push({ id: tagId });
			} else {
				section.activeTags = section.activeTags.filter(({ id }) => id !== tagId);
			}

			// Getting new articles list
			const body: SectionReconfigRequest = { sectionId: section.meta.id, tagId, checked };
			try {
				const response = await fetch($page.url, {
					method: 'POST',
					body: JSON.stringify(body)
				});
				if (response.ok) {
					const result: SectionFetchReturn = await response.json();

					if (result) {
						const enriched = await enrichPreviewFamilies(result.previewFamilies);

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
		sectionContext.activeTags = section.activeTags;
	});

	setContext('section', sectionContext);
</script>

<section class="section">
	<div class="description" class:disabled={sectionContext.activeTags.length === 0}>
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
			<div class="empty">
				<!-- TODO: Show other translation if page is not of actor -->
				<Typography>
					<Translation key="page_actor.section.no_articles" />
				</Typography>
			</div>
		{/if}
	</div>
</section>

<style>
	.description {
		max-width: var(--size-section-max-width);
		transition: var(--transition-section-description);
	}
	.description.disabled {
		opacity: var(--opacity-section-description-disabled);
	}
	.section {
		position: relative;
		margin-bottom: var(--size-section-margin-bottom);
	}
	.articles-list-wrapper {
		margin-top: var(--size-section-articles-list-margin-top);
	}
	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-section-empty-bg);
		border-radius: var(--size-section-empty-border-radius);
		padding-block: var(--size-section-empty-padding-block);
		padding-inline: var(--size-section-empty-padding-inline);
		color: var(--color-section-empty-text);
	}
</style>
