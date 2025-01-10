<script lang="ts">
	import { Button, InfoBlock } from '@plavna/design/components';
	import { page } from '$app/stores';
	import { parse } from 'devalue';
	import { setContext } from 'svelte';
	import { ARTICLES_PER_SECTION } from '$lib/common/config';

	import Translation from '../i18n/Translation.svelte';
	import { enrichPreviewFamilies } from '../preview/enricher';
	import type { TagSelect } from '../tag/validators';
	import ArticlesList from './ArticlesList.svelte';
	import SectionEditor from './SectionEditor.svelte';
	import SectionViewer from './SectionViewer.svelte';
	import type { SectionService } from './service';
	import type {
		SectionContext,
		SectionProp,
		SectionPropWithAuthorship,
		SectionRequest
	} from './types';

	type Props = {
		section: SectionProp;
	};

	let { section = $bindable() }: Props = $props();

	let initialPaginator = {
		offset: 0,
		listenForEndInView: section.articles.length === ARTICLES_PER_SECTION,
		loading: null
	};

	let paginator: {
		offset: number;
		listenForEndInView: boolean;
		loading: AbortController | null;
	} = $state(structuredClone(initialPaginator));

	let editorOpened = $state(false);

	type SectionFetchReturn = Awaited<ReturnType<SectionService['getOne']>>;

	const sectionContext: SectionContext = $state({
		id: section.meta.id,
		activeTags: section.activeTags,
		onTagSwitch,
		loadingTagId: null
	});

	$effect(() => {
		sectionContext.activeTags = Array.from(section.activeTags);
	});

	setContext('section', sectionContext);

	function sectionHasForms(section: SectionProp): section is SectionPropWithAuthorship {
		return Boolean(section.forAuthor);
	}

	function onEditorOpen() {
		editorOpened = true;
	}

	async function onTagSwitch(tagId: TagSelect['id'], checked: boolean) {
		sectionContext.loadingTagId = tagId;

		const body: SectionRequest = {
			sectionId: section.meta.id,
			tagId,
			newChecked: checked
		};

		try {
			const result = await performRequest($page.url, body);
			await updateGlobalStates(result);
		} catch (err) {
			console.error(err);
		} finally {
			if (sectionContext.loadingTagId === tagId) {
				sectionContext.loadingTagId = null;
			}
		}
	}

	async function onEndInView() {
		const newOffset = paginator.offset + ARTICLES_PER_SECTION;
		const body: SectionRequest = {
			sectionId: section.meta.id,
			offset: newOffset
		};
		try {
			const result = await performRequest($page.url, body);
			await updateGlobalStates(result, newOffset);
		} catch (err) {
			console.error(err);
		}
	}

	async function performRequest(
		url: URL,
		body: SectionRequest
	): Promise<SectionFetchReturn | null> {
		try {
			paginator.loading?.abort();
			paginator.loading = new AbortController();
			paginator.listenForEndInView = false;

			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(body),
				signal: paginator.loading?.signal
			});

			paginator.loading = null;

			if (response.ok) {
				const resultString: string = await response.text();
				return parse(resultString) as SectionFetchReturn;
			} else {
				console.error('Request failed with status:', response.status);
			}
		} catch (err) {
			console.error('Error during request:', err);
		}

		return null;
	}

	async function updateGlobalStates(result: SectionFetchReturn, newOffset?: number) {
		if (!result) {
			if (typeof newOffset === 'number') {
				paginator.listenForEndInView = false;
			}
			return;
		}

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
		} else {
			console.error('Required global states not found');
		}

		const { section: newSection } = result;
		const { articles: newArticles, ...other } = newSection;

		if (typeof newOffset === 'number') {
			section = { ...other, articles: [...section.articles, ...newArticles] };
			paginator.listenForEndInView = newArticles.length === ARTICLES_PER_SECTION;
			paginator.offset = newOffset;
		} else {
			section = { ...other, articles: newArticles };
			paginator = structuredClone(initialPaginator);
		}
	}
</script>

<section class="section">
	{#if sectionHasForms(section) && !editorOpened}
		<div class="actions-wrapper">
			<Button size="small" kind="secondary" onclick={onEditorOpen}>
				<Translation key="page_actor.section.edit" />
			</Button>
		</div>
	{/if}

	<div class="description">
		{#if sectionHasForms(section) && editorOpened}
			<SectionEditor
				mainForm={section.forAuthor.updating}
				deletionForm={section.forAuthor.deletion}
				onCancel={() => (editorOpened = false)}
				onSuccessfullUpdate={() => (editorOpened = false)}
			/>
		{:else}
			<SectionViewer {section} {onEditorOpen} />
		{/if}
	</div>

	{#if section.articles.length > 0}
		<div class="articles-list-wrapper">
			<ArticlesList {section} {onEndInView} listenForEndInView={paginator.listenForEndInView} />
		</div>
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
</section>

<style>
	.section {
		position: relative;
		margin-bottom: var(--size-section-margin-bottom);
		transition: opacity 0.5s;
	}

	.actions-wrapper {
		position: absolute;
		left: 0;
		top: var(--size-description-viewer-actions-top);
	}

	.description {
		max-width: var(--size-section-description-max-width);
		transition: var(--transition-section-description);
	}

	.articles-list-wrapper,
	.info-block-wrapper {
		margin-top: var(--size-section-articles-list-margin-top);
		padding-bottom: var(--size-l);
	}

	.articles-list-wrapper {
		margin-inline: calc(var(--size-main-grid-padding-inline) * -1);
		overflow: auto;
		scrollbar-width: thin;
		position: relative;
		max-width: calc(100% + var(--size-main-grid-padding-inline) * 2);
	}
</style>
