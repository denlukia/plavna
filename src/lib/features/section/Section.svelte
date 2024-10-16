<script lang="ts">
	import { page } from '$app/stores';
	import { parse } from 'devalue';
	import { setContext } from 'svelte';
	import InfoBlock from '$lib/design/components/InfoBlock/InfoBlock.svelte';

	import ArticlesList from '../article/ArticlesList.svelte';
	import Translation from '../i18n/Translation.svelte';
	import { enrichPreviewFamilies } from '../preview/enricher';
	import type { TagSelect } from '../tag/parsers';
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
	};

	let { section = $bindable() }: Props = $props();

	let editorOpened = $state(false);
	let abortController: AbortController | null = $state(null);

	function sectionHasForms(section: SectionProp): section is SectionPropWithAuthorship {
		return Boolean(section.forms);
	}

	function onEditorOpen() {
		editorOpened = true;
	}

	async function onTagSwitch(tagId: TagSelect['id'], checked: boolean) {
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
				const resultString: string = await response.text();
				const result: SectionFetchReturn = parse(resultString);

				if (result) {
					const recordsTranslationsState = $page.data.recordsTranslationsState;
					const previewFamiliesState = $page.data.previewFamiliesState;
					const imagesState = $page.data.imagesState;

					if (recordsTranslationsState && previewFamiliesState && imagesState) {
						recordsTranslationsState.value = {
							...recordsTranslationsState.value,
							...result.recordsTranslations
						};
						imagesState.value = {
							...imagesState.value,
							...result.images
						};
						const enriched = await enrichPreviewFamilies(result.previewFamilies, 'viewer');
						previewFamiliesState.value = {
							...previewFamiliesState.value,
							...enriched
						};
						section = result.section;
					} else {
						console.error('Records translations state or preview families state not found');
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	type SectionFetchReturn = Awaited<ReturnType<SectionService['getOne']>>;

	const sectionContext: SectionContext = $state({
		id: section.meta.id,
		activeTags: section.activeTags,
		onTagSwitch
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
			<div class="info-block-wrapper">
				<InfoBlock>
					{#if $page.params.username === $page.data.actor?.username}
						<Translation key="page_actor.section.no_articles" />
					{:else}
						<Translation key="page.section.no_articles" />
					{/if}
				</InfoBlock>
			</div>
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
	.info-block-wrapper {
		margin-inline: var(--size-main-grid-padding-inline);
	}
</style>
