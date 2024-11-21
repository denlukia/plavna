<script lang="ts">
	import { page } from '$app/stores';
	import { parse } from 'devalue';
	import { setContext } from 'svelte';
	import { ARTICLES_PER_SECTION } from '$lib/collections/config';
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
		SectionRequest
	} from './types';

	type Props = {
		section: SectionProp;
	};

	let { section = $bindable() }: Props = $props();

	let currentOffset = 0;
	let editorOpened = $state(false);
	let abortController: AbortController | null = $state(null);

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
			if (result) {
				await updateGlobalStates(result, 'replace');
			}
		} catch (err) {
			console.error(err);
		} finally {
			if (sectionContext.loadingTagId === tagId) {
				sectionContext.loadingTagId = null;
			}
		}
	}

	// TODO: Rewrite to make request only when scrolled to the edge
	async function onScroll(e: PointerEvent) {
		// const offset = currentOffset + ARTICLES_PER_SECTION;
		// const body: SectionRequest = {
		// 	sectionId: section.meta.id,
		// 	offset
		// };
		// try {
		// 	const result = await performRequest($page.url, body);
		// 	if (result) {
		// 		await updateGlobalStates(result, triggerType === 'newer' ? 'insert-start' : 'insert-end');
		// 	}
		// } catch (err) {
		// 	console.error(err);
		// }
	}

	async function performRequest(
		url: URL,
		body: SectionRequest
	): Promise<SectionFetchReturn | null> {
		try {
			abortController?.abort();
			abortController = new AbortController();

			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(body),
				signal: abortController?.signal
			});

			abortController = null;

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

	async function updateGlobalStates(
		result: NonNullable<SectionFetchReturn>,
		articlesInsertionType: 'replace' | 'insert-start' | 'insert-end'
	) {
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

		if (articlesInsertionType === 'replace') {
			section = { ...other, articles: newArticles };
		} else if (articlesInsertionType === 'insert-start') {
			section = { ...other, articles: [...newArticles, ...section.articles] };
		} else if (articlesInsertionType === 'insert-end') {
			section = { ...other, articles: [...section.articles, ...newArticles] };
		}
	}

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
</script>

<section class="section" class:disabled={sectionContext.activeTags.length === 0 && !editorOpened}>
	<div class="description">
		{#if sectionHasForms(section) && editorOpened}
			<SectionEditor
				mainForm={section.forAuthor.updating}
				deletionForm={section.forAuthor.deletion}
				onCancel={() => (editorOpened = false)}
				onSuccessfullUpdate={() => (editorOpened = false)}
			/>
		{:else}
			<DescriptionViewer {section} {onEditorOpen} showEditButton={sectionHasForms(section)} />
		{/if}
	</div>

	{#if section.articles.length > 0}
		<div class="articles-list-wrapper" on:scroll={onScroll}>
			<ArticlesList {section} />
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
	.description {
		max-width: var(--size-section-max-width);
		transition: var(--transition-section-description);
	}

	.section {
		position: relative;
		margin-bottom: var(--size-section-margin-bottom);
		transition: opacity 0.5s;
	}

	.disabled {
		opacity: 0.25;
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
	}
	.info-block-wrapper {
		margin-inline: var(--size-main-grid-padding-inline);
	}
</style>
