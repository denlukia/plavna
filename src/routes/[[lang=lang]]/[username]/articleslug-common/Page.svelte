<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import AnimatedPage from '$lib/design/components/AnimatedPage/AnimatedPage.svelte';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Column from '$lib/design/components/Grid/Column.svelte';
	import ColumnsContainer from '$lib/design/components/Grid/ColumnsContainer.svelte';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';
	import { generatePath } from '$lib/features/common/links';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import { getPreviewData } from '$lib/features/preview/utils';

	import type { PageData } from '../[articleslug]/$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let { article, tags, actor, previewComponent: PreviewComponent, routeId, lang } = $derived(data);
	let recordsTranslations = $derived($page.data.recordsTranslationsState?.value);
	let images = $derived($page.data.imagesState?.value);
	let user = $derived($page.data.user);

	let editHref = $derived(
		generatePath('/[lang]/[username]/[pageslug]/[articleslug]/edit', $page.params)
	);

	// TODO: Turned out to be buggy, I'm in shambles
	// let conf = $derived({ key: article?.slug });
	// let isOnArticle = $derived($page.params?.['articleslug'] === article.slug);
</script>

<AnimatedPage key={routeId + article.id + lang}>
	<ColumnsContainer>
		<Column cols={3} style="margin-inline: auto;">
			<article class="article">
				{#if PreviewComponent}
					<!-- {#if isOnArticle} -->
					<!-- <div class="preview-animator" in:receive|global={conf} out:send|global={conf}> -->
					<GridContainer>
						<GridCell cols={3} rows={3}>
							<PreviewComponent
								data={getPreviewData(
									{ meta: article, tags },
									recordsTranslations,
									images,
									user,
									true
								)}
							/>
						</GridCell>
					</GridContainer>
					<!-- </div> -->
					<!-- {/if} -->
				{:else}
					No preview
				{/if}
				<div class="content">
					<Translation recordKey={data.article.content_translation_key} markdown />
				</div>
			</article>
		</Column>
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

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
