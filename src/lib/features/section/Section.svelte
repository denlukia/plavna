<script lang="ts">
	import { page } from '$app/stores';
	import { setContext } from 'svelte';

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

	<ArticlesList {section} />
</section>

<style>
	.description {
		max-width: var(--size-section-max-width);
	}
	.section {
		position: relative;
		margin-bottom: var(--size-section-margin-bottom);
	}
</style>
