<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Column from '$lib/design/components/Grid/Column.svelte';
	import ColumnsContainer from '$lib/design/components/Grid/ColumnsContainer.svelte';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';
	import BlockAnimator from '$lib/features/animations/BlockAnimator.svelte';
	import { generatePath } from '$lib/features/common/links';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import { getPreviewData } from '$lib/features/preview/utils';

	import type { PageData } from '../[articleslug]/$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let { article, tags, actor, previewComponent: PreviewComponent, routeId } = $derived(data);
	let recordsTranslations = $derived($page.data.recordsTranslationsState?.value);
	let images = $derived($page.data.imagesState?.value);
	let user = $derived($page.data.user);

	let editHref = $derived(
		generatePath('/[lang]/[username]/[pageslug]/[articleslug]/edit', $page.params)
	);
</script>

<BlockAnimator {routeId} articleId={article.id}>
	<ColumnsContainer>
		<Column cols={3} style="margin-inline: auto;">
			<article class="article">
				{#if PreviewComponent}
					<GridContainer>
						<GridCell cols={3} rows={3}>
							<PreviewComponent
								data={getPreviewData({ meta: article, tags }, recordsTranslations, images, user)}
							/>
						</GridCell>
					</GridContainer>
				{:else}
					No preview
				{/if}
				<div class="content">
					<Translation recordKey={data.article.content_translation_key} markdown />
				</div>
			</article>
		</Column>
	</ColumnsContainer>
</BlockAnimator>

{#if actor && article.user_id === actor.id}
	<div class="main-actions">
		<Button href={editHref} kind="secondary">
			<Translation key="article.edit" />
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
	}
	.article {
		margin-top: var(--size-4xl);
		margin-inline: auto;
		margin-bottom: var(--size-6xl);
	}

	.content {
		margin-top: var(--size-xl);
	}
</style>
