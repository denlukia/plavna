<script lang="ts">
	import {
		AnimatedPage,
		Button,
		Column,
		ColumnsContainer,
		GridCell,
		GridContainer
	} from '@plavna/design/components';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { PAGE_INRO_DELAY_MS } from '$lib/common/config';
	import { generatePath } from '$lib/common/links';
	import Translation from '$lib/i18n/Translation.svelte';
	import { getRecordTranslation } from '$lib/i18n/utils';
	import { getTitle } from '$lib/layout/title';
	import { getPreviewData } from '$lib/preview/utils';
	import {
		ARTICLE_OPENED_MOBILE_PREVIEW_COLS,
		ARTICLE_OPENED_MOBILE_PREVIEW_ROWS,
		ARTICLE_OPENED_PREVIEW_COLS,
		ARTICLE_OPENED_PREVIEW_ROWS
	} from '$lib/styles/grid';

	import type { PageData } from '../[articleslug]/$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let {
		article,
		tags,
		actor,
		previewComponent: PreviewComponent,
		routeId,
		lang,
		themeComponentLayers,
		themeSet,
		previewTemplateUrl
	} = $derived(data);
	let recordsTranslations = $derived($page.data.recordsTranslationsState?.value);
	let images = $derived($page.data.imagesState?.value);
	let user = $derived($page.data.user);

	let backToArticlesHref = $derived(generatePath('/[lang]/[username]/[pageslug]', $page.params));

	let editHref = $derived(
		generatePath('/[lang]/[username]/[pageslug]/[articleslug]/edit', $page.params)
	);

	let titleTranslation = getRecordTranslation(article.title_translation_key, recordsTranslations);

	let title = $derived(getTitle($page.params, `${titleTranslation}`));
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div
	class="back-button"
	in:fade|global={{ duration: 400, delay: PAGE_INRO_DELAY_MS }}
	out:fade|global={{ duration: 400 }}
>
	<Button href={backToArticlesHref} kind="prominent">
		↰ <Translation key="article.back_to_articles" />
	</Button>
</div>

<AnimatedPage key={routeId + article.id + lang} introDelay={PAGE_INRO_DELAY_MS}>
	<ColumnsContainer>
		<article class="article">
			{#if PreviewComponent}
				<GridContainer>
					<GridCell
						cols={ARTICLE_OPENED_PREVIEW_COLS}
						rows={ARTICLE_OPENED_PREVIEW_ROWS}
						mobileCols={ARTICLE_OPENED_MOBILE_PREVIEW_COLS}
						mobileRows={ARTICLE_OPENED_MOBILE_PREVIEW_ROWS}
					>
						<PreviewComponent
							data={getPreviewData(
								{ meta: article, tags, previewTemplateUrl },
								recordsTranslations,
								images,
								user,
								true,
								lang
							)}
						/>
					</GridCell>
				</GridContainer>
			{/if}

			<Column cols={2.5} style="margin-inline: auto;">
				<div class="description">
					<Translation
						recordKey={data.article.description_translation_key}
						wrapTranslation={(t) => `### ${t}`}
						markdown
						showNoTranslation={false}
					/>
				</div>
			</Column>

			<Column cols={2.5} style="margin-inline: auto;">
				<div class="content">
					<Translation
						recordKey={data.article.content_translation_key}
						markdown
						showNoTranslation={false}
					/>
				</div>
			</Column>
		</article>
	</ColumnsContainer>
</AnimatedPage>

{#if actor && article.user_id === actor.id}
	<div class="main-actions" out:fade|global>
		<Button href={editHref} kind="secondary">
			<Translation key="article_actor.edit" />
		</Button>
	</div>
{/if}

<style>
	.main-actions {
		position: fixed;
		z-index: 1;
		bottom: var(--size-article-actions-bottom);
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-article-actions-bg);
		box-shadow: var(--shadow-article-actions);
		padding-inline: var(--size-article-actions-padding-inline);
		padding-block: var(--size-article-actions-padding-block);
		border-radius: var(--size-article-actions-border-radius);
		display: flex;
		justify-content: center;
		gap: var(--size-article-actions-gap);

		animation: fade-in 400ms 350ms cubic-bezier(0.215, 0.61, 0.355, 1) backwards;
	}

	.article {
		margin-top: var(--size-4xl);
		margin-inline: auto;
		margin-bottom: var(--size-6xl);
	}

	.content {
		margin-top: var(--size-xl);
	}

	.description {
		margin: 0 auto;
	}

	.description :global(*) {
		margin-top: 0.5rem;
		text-align: center;
	}

	.back-button {
		position: absolute;
		top: 0;
		left: 0;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
